var gulp = require('gulp');
var ts = require('gulp-typescript');
var exec = require('child_process').exec;
var concat = require('gulp-concat');
var include = require('gulp-include');
var webpack = require('webpack-stream');

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
        .pipe(webpack({"optimization": { "minimize": false }, "output": { "path": __dirname + "build/bundle", "filename": "bundle.js", "libraryTarget": "var", "library": "CilantroJS" }, "entry": "./build/js/contract.js", "context": __dirname }))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('build/bundle'))
});
