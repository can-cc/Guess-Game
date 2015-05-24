var fs = require('fs');
var path = require('path');

var gulp = require('gulp');

// ---------------------------------------------------------------------
// | My Var                                                               |
// ---------------------------------------------------------------------
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');

gulp.task('sass:app', function(){
  gulp.src(['scss/**/*.scss'])
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(connect.reload())
    .pipe(livereload());
});

gulp.task('watch:app', function(){
  gulp.watch(['scss/**/*.scss'],
             ['sass:app']);
});

gulp.task('connect', function(){
  connect.server({
    root: "app",
    host: "0.0.0.0",
    port: 2121,
    livereload: true
  });
});

gulp.task('connect:html', function() {
  gulp.src('app/**/*.html')
    .pipe(connect.reload());
});

gulp.task('connect:css', function() {
  gulp.src('app/css/**/*.css')
    .pipe(connect.reload());
});

gulp.task('connect:watch', function() {
  gulp.watch(['app/**/*.html'], ['connect:html']);
  gulp.watch(['app/css/**/*.css'], [ 'connect:css']);
});

gulp.task('serve',
          ['sass:app',
           'connect',
           'connect:html',
           'connect:css',
           'connect:watch',
           'watch:app'
          ]);
