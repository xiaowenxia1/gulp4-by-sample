var gulp = require('gulp'),
    connect = require('gulp-connect'),
    del = require('del'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    htmlreplace = require('gulp-html-replace'),
    sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS   = require('gulp-clean-css');

gulp.task('connect', function() {
  connect.server({
      root: 'dist',
      livereload: true
  });
});

 gulp.task('clean', function() {
   return del([
       'dist/**/*'
     ]);
 });


gulp.task('copy-dev', function() {
    return   gulp.src('./src/**/*')
               .pipe(gulp.dest('./dist')
             );
});

gulp.task('force-reload', function() {
  return   gulp.src('./src/*.html')
             .pipe(connect.reload());
});

gulp.task('sass', function () {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

gulp.task('generate-prod-html', function() {
  return   gulp.src('./src/index.html')
             .pipe(htmlreplace({
               'js': '<script src="app.min.js"></script>',
               'sass': '<link rel="stylesheet" href="main.css">'
             }))
             .pipe(gulp.dest('./dist')
           );

});

gulp.task('create-bundle-js', function() {
    return gulp.src('./src/**/*.js')
              .pipe(concat('app.min.js'))
              .pipe(gulp.dest('dist'))
              .pipe(uglify())
              .pipe(gulp.dest('dist'));
});

gulp.task('build-dev', gulp.series(
          'clean', 'copy-dev', 'sass',
          gulp.parallel('generate-prod-html','create-bundle-js')));




gulp.task('watch', function() {
  gulp.watch(['./src/**/*.html', './src/**/*.js', './src/sass/**/*.scss'], gulp.series('build-dev', 'force-reload'))
});


gulp.task('web', gulp.parallel('connect', 'watch'));
gulp.task('default', gulp.series('web'));
