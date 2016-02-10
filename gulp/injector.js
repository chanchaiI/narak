var gulp = require('gulp');
var path = require('path');


gulp.task('inject', function () {

    var injectOptions = {

    };

    var injectStyles = gulp.src([
            // selects all css files from the .tmp dir
            paths.tmp + '/**/*.css'
        ], { read: false }
    );

    var injectScripts = gulp.src([
        // selects all js files from .tmp dir
        paths.tmp + '/**/*.js',
        // but ignores test files
        '!' + paths.src + '/**/*.test.js'
        // then uses the gulp-angular-filesort plugin
        // to order the file injection
    ]).pipe($.angularFilesort()
        .on('error', $.util.log));
    // tell wiredep where your bower_components are
    var wiredepOptions = {
        directory: 'bower_components'
    };

    return gulp.src(paths.src + '/*.html')
        .pipe($.inject(injectStyles, injectOptions))
        .pipe($.inject(injectScripts, injectOptions))
        .pipe(wiredep(wiredepOptions))
        // write the injections to the .tmp/index.html file
        .pipe(gulp.dest(paths.tmp));
    // so that src/index.html file isn't modified  
    // with every commit by automatic injects

});