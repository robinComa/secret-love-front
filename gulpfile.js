'use strict';

var gulp = require('gulp');
var open = require('open');
var runSequence = require('run-sequence');
var karma = require('gulp-karma');
var bower = require('./bower.json');
var $ = require('gulp-load-plugins')();

gulp.task('clean', function () {
    return gulp.src(['dist'], { read: false }).pipe($.clean());
});

gulp.task('styles', function () {
	return gulp.src('app/src/main/main.scss')
		.pipe($.plumber())
		.pipe($.sass())
		.pipe($.autoprefixer('last 1 version'))
		.pipe(gulp.dest('app/src/main/'));
});

gulp.task('img', function () {
    return gulp.src([
        'app/img/**/*'
    ]).pipe(gulp.dest('dist/img/'));
});

gulp.task('i18n', function () {
    return gulp.src([
        'app/i18n/**/*json'
    ]).pipe(gulp.dest('dist/i18n/'));
});

gulp.task('stub', function () {
    return gulp.src([
        'app/stub/data/**/*.json'
    ]).pipe(gulp.dest('dist/stub/data/'));
});

gulp.task('html', ['styles'], function () {
    var assets = $.useref.assets();
    var jsFilter = $.filter('app/**/*.js');
    var cssFilter = $.filter('app/**/*.css');
    return gulp.src('app/index.html')
        .pipe(assets)
        .pipe(jsFilter)
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist/'));
});

gulp.task('template', function () {
    return gulp.src(['app/src/**/*.html']).pipe($.angularTemplatecache({
        module: 'app', root: 'src/'
    })).pipe(gulp.dest('dist/scripts/'));
});

gulp.task('jshint', function() {
    return gulp.src('app/src/**/*.js')
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('manifest', function(){
    return gulp.src(['dist/**/*'])
        .pipe($.manifest({
            hash: true,
            preferOnline: false,
            basePath: 'dist',
            network: ['*'],
            filename: 'app.manifest',
            exclude: 'app.manifest'
        }))
        .pipe($.replace(/%5C/g, '/'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('dist', ['jshint', 'clean'], function(callback){
    runSequence(['html', 'template', 'img', 'i18n', 'stub'], 'manifest', callback);
});

gulp.task('deploy', ['dist'], function () {
    return gulp.src('dist/**/*').pipe($.ghPages({
        remoteUrl: bower.repository.url
    }));
});

gulp.task('test:unit', function () {
    return gulp.src('not-exist.js').pipe($.plumber()).pipe($.karma({configFile: 'karma.conf.js'}));
});

gulp.task('serve:app', ['styles'], function () {
    $.connect.server({
        root: ['app'],
        port: 9000,
        livereload: true
    });
    open('http://localhost:9000/#/');
});

gulp.task('serve:dist', ['dist'], function () {
    $.connect.server({
        root: ['dist'],
        port: 9001,
        livereload: true
    });
    open('http://localhost:9001/#/');
});

gulp.task('serve', ['serve:app'], function () {
    gulp.watch([
        'app/index.html',
        'app/main.css',
        'app/*.js',
        'app/src/**/*.js',
        'app/src/**/*.html'
    ], function (event) {
        return gulp.src(event.path).pipe($.connect.reload());
    });
    gulp.watch('app/**/*.scss', ['styles']);
});