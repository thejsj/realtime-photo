/*jshint node:true */
'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var shell = require('gulp-shell');

var sass = require('node-sass');
var concat = require('gulp-concat');
var fs = require('fs');
var path = require('path');

gulp.task('watchify', function(){
  var bundler = browserify({
      entries: ['./client/src/js/main.js'], // Only need initial file, browserify finds the deps
      transform: [reactify], // We want to convert JSX to normal javascript
      cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });
  var watcher  = watchify(bundler);
  return watcher
    .on('update', function () { // When any files update
        var updateStart = Date.now();
        watcher.bundle() // Create new bundle that uses the cache for high performance
        .pipe(source('main.js'))
        // .pipe(streamify(uglify()))
        .pipe(gulp.dest('./client/dist/'));
        console.log('Updated!', (Date.now() - updateStart) + 'ms');
    })
    .bundle() // Create the initial bundle when starting the task
    .pipe(source('main.js'))
    // .pipe(streamify(uglify()))
    .pipe(gulp.dest('./client/dist/'));
});

gulp.task('browserify', function(){
  var bundler = browserify({
      entries: ['./client/src/js/main.js'], // Only need initial file, browserify finds the deps
      transform: [reactify], // We want to convert JSX to normal javascript
      cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });
  return bundler
    .bundle() // Create the initial bundle when starting the task
    .pipe(source('main.js'))
    .pipe(gulp.dest('./client/dist/'));
});


gulp.task('sass', function () {
  sass.render({
    file: './client/src/scss/main.scss',
  }, function (err, result) {
    if (err) {
      console.log(err);
    }
    fs.writeFileSync(
      path.join(__dirname, '/client/dist/main.css'),
      result.css.toString()
    );
  });
});

gulp.task('watch', ['browserify'], function () {
  gulp.watch('./client/src/scss/**/*.scss', ['sass']);
  gulp.watch('./client/src/js/**/*.js', ['watchify']);
});

gulp.task('default', ['browserify', 'sass']);
gulp.task('build', ['browserify', 'sass']);
