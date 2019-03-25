var gulp = require('gulp');
var ts = require('gulp-typescript');
var exec = require('child_process').exec;
var concat = require('gulp-concat');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('setup', function(cb) {
    exec('make build', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('transpile', function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('build/js'))
});

gulp.task('bundlejs', function() {
    return gulp.src(['build/js/*.js'])
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('build/bundle'))
});
