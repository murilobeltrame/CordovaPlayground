(function() {

    'use strict';

    var gulp = require('gulp'),
        del = require('del'),
        $ = require('gulp-load-plugins')();

    gulp.task('clean', function() {
        return del('www/');
    });

    gulp.task('wiredep', function() {
        gulp.src('src/*.html')
            .pipe($.wiredep())
            .pipe(gulp.dest('src'));
    });

    gulp.task('bundle', function() {

        var js_filter = $.filter('**/*.js', { restore: true });
        var css_filter = $.filter('**/*.css', { restore: true });

        gulp.src('src/*.html')
            .pipe($.useref())
            .pipe(gulp.dest('www'));
    });

    gulp.task('default', function() {});

}());