var gulp = require('gulp');
var path = require('path');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var cssmin = require('gulp-cssmin');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var path = require('path');
var Builder = require('systemjs-builder');

gulp.task('sass:clean', function () {
    return gulp.src(['./stylesheets/main.*'])
                .pipe(clean());
});

gulp.task('sass:build-dev', ['sass:clean'], function () {

    return gulp.src(['sass/main.scss'])
                .pipe(sourcemaps.init())
                .pipe(sass())
                .on('error', function (error) {
                    console.error(error); 
                    this.emit('end');
                 })
                .pipe(autoprefixer())
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest('stylesheets/'));
});

gulp.task('sass:build-prod', ['sass:clean'], function () {

    return gulp.src(['sass/main.scss'])
                .pipe(sass())
                .on('error', function (error) {
                    console.error(error);
                    this.emit('end');
                })
                .pipe(autoprefixer())
                .pipe(cssmin())
                .pipe(gulp.dest('stylesheets/'));
});

gulp.task('sass:watch', function () {
    gulp.watch(['sass/**/*.scss'], ['sass:build-dev'])
});

gulp.task('js:bundle', function () {
    var builder = new Builder('', './config.js');
    builder.buildStatic('app/**/*.js', 'bundle.js', {minify: true});
});

gulp.task('js:bundle-watch', function () {
    gulp.watch(['app/**/*.js'], ['js:bundle'])
});