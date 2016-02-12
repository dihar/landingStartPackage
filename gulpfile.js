var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var concat       = require('gulp-concat');
var less         = require('gulp-less');
var plumber      = require('gulp-plumber');
var notify       = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var rename       = require("gulp-rename");
var minify       = require("gulp-minify-css");
var uglify       = require("gulp-uglify");
var reload       = browserSync.reload;

gulp.task('serve', function(){
	browserSync.init({
		server:{
			baseDir: './'
		},
		notify: false,
		open: false
	});
});

gulp.task('js',function(){
	return gulp.src('js/main.js')
		.pipe(plumber({
	    	errorHandler: notify.onError('JS error: <%= error.message %>')
	    }))
		.pipe(concat('main-min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('js/'))
		.pipe(browserSync.stream());
});

gulp.task('jq',function(){
	return gulp.src(['bower_components/jquery/dist/jquery.min.js',
			'bower_components/bootstrap/dist/js/bootstrap.min.js'])
	.pipe(concat('jqBt.js'))
	.pipe(gulp.dest('js/'));
})

gulp.task('less', function(){
	return gulp.src('./less/main.less')
		.pipe(plumber({
	    	errorHandler: notify.onError('LESS error: <%= error.message %>')
	    }))
	    .pipe(less())
	    .pipe(autoprefixer({
	    	browsers: ['last 10 versions']
	    }))
	    .pipe(rename('style.css'))
	    .pipe(minify())
	    .pipe(gulp.dest('./'))
	    .pipe(browserSync.stream());
})

gulp.task('bootstrap', function(){
	return gulp.src('bower_components/bootstrap/less/bootstrap.less')
		.pipe(less())
	    .pipe(autoprefixer({
	    	browsers: ['last 10 versions']
	    }))
	    .pipe(minify())
	    .pipe(rename('bootstrap.css'))
	    .pipe(gulp.dest('./less/'));
})

gulp.watch(['js/main.js'], ['js'])
gulp.watch(['less/*.less'], ['less'])
gulp.watch(['./*.html'], reload)

gulp.task('default', ['serve']);