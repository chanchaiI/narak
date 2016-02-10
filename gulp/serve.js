var gulp  = require('gulp');
var browserSync = require('browser-sync');

gulp.task('serve', ['watch'], function () {

    // Serve files from the root of this project
    browserSync({
        server: {
            baseDir: "./src/app"
        }
    });

});