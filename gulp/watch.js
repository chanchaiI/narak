var gulp  = require('gulp');

gulp.task('watch', [], function() {
    gulp.watch("src/app/**/*.js", ['bs-reload']).on('change', reportChange);
});

function reportChange(event){
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}