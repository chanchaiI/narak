var gulp = require('gulp');
var path = require('path');
var wiredep = require('wiredep');
var angularFilesort = require('gulp-angular-filesort');
var inject = require('gulp-inject');


gulp.task('inject', function () {

    var injectOptions = {
        relative: true
    };

    var injectStyles = gulp.src([
            // selects all css files from the .tmp dir
            path.tmp + '/**/*.css'
        ], { read: false }
    );

    var injectScripts = gulp.src([
        // selects all js files from .tmp dir
        path.tmp + '/**/*.js',
        // but ignores test files
        '!' + path.src + '/**/*.test.js'
        // then uses the gulp-angular-filesort plugin
        // to order the file injection
    ]).pipe(angularFilesort());
        //.on('error', $.util.log));


    var wiredepOptions = {
        directory: 'bower_components'
    };

    return gulp.src(path.src + '/*.html')
        .pipe(inject(injectStyles, injectOptions))
        .pipe(inject(injectScripts, injectOptions))
        .pipe(wiredep(wiredepOptions))
        // write the injections to the .tmp/index.html file
        .pipe(gulp.dest(path.tmp));
    // so that src/index.html file isn't modified  
    // with every commit by automatic injects

});