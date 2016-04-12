"use strict";
const gulp         = require('gulp');
const browserSync  = require('browser-sync');
const concat       = require('gulp-concat');
const less         = require('gulp-less');
const plumber      = require('gulp-plumber');
const notify       = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const rename       = require("gulp-rename");
const minify       = require("gulp-minify-css");
const uglify       = require("gulp-uglify");
const reload       = browserSync.reload;
const sourcemaps   = require('gulp-sourcemaps');
const spritesmith  = require('gulp.spritesmith');
const del          = require('del');

const destPath     = './dist/';
const srcPath      = './src/';

gulp.task('serve', ()=>{
	browserSync.init({
		server:{
			baseDir: './'
		},
		notify: false,
		open: false
	});
});

gulp.task('clean:imgs', ()=>{
	del(destPath + 'imgs/**/!(sprite).*');
});

gulp.task('jq', ()=>{
	return gulp.src(['bower_components/jquery/dist/jquery.js',
					 'bower_components/bootstrap/js/modal.js'])
	.pipe(concat('jqBt.js'))
	.pipe(uglify())
	.pipe(gulp.dest(destPath + 'js/'));
});

gulp.task('bootstrap', ()=>{
	return gulp.src(srcPath + 'less/bootstrap.less')
		.pipe(less())
	    .pipe(autoprefixer({
	    	browsers: ['last 10 versions']
	    }))
	    .pipe(minify())
	    .pipe(rename('bootstrap.css'))
	    .pipe(gulp.dest(destPath + 'css/'))
	    .pipe(browserSync.stream());
});

gulp.task('js',()=>{
	return gulp.src(srcPath+'js/main.js')
		.pipe(plumber({
	    	errorHandler: notify.onError('JS error: <%= error.message %>')
	    }))
	    .pipe(sourcemaps.init())
		.pipe(concat('main-min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write(destPath + 'js/'))
		.pipe(gulp.dest(destPath + 'js/'))
		.pipe(browserSync.stream());
});


gulp.task('less', ()=>{
	return gulp.src(srcPath + 'less/main.less')
		.pipe(plumber({
	    	errorHandler: notify.onError('LESS error: <%= error.message %>')
	    }))
	    .pipe(sourcemaps.init())
	    .pipe(less())
	    .pipe(autoprefixer({
	    	browsers: ['last 10 versions']
	    }))
	    .pipe(rename('style.css'))
	    .pipe(gulp.dest(destPath + 'css/'))
	    .pipe(minify())
	    .pipe(sourcemaps.write(destPath + 'css/'))
	    .pipe(gulp.dest('./'))
	    .pipe(browserSync.stream());
});

gulp.task('sprite',()=>{
	let spriteData = 
		gulp.src(srcPath + 'imgs/sprite/*.*')
			.pipe(spritesmith({
			    imgName: 'sprite.png',
			    cssName: 'sprite.less',
			    imgPath: destPath + 'imgs/sprite.png'
			}));

	spriteData.img.pipe(gulp.dest(destPath + 'imgs/'));
    spriteData.css.pipe(gulp.dest(srcPath + 'less/'));
});

gulp.task('images',['clean:imgs'],()=>{
	return gulp.src([srcPath + 'imgs/**/*.*', '!' + srcPath + 'imgs/sprite/*.*'])
		.pipe(gulp.dest(destPath + 'imgs/'))
		.pipe(browserSync.stream());
});

gulp.task('watch', ()=>{
	gulp.watch([srcPath + 'js/main.js'], ['js']);
	gulp.watch([srcPath + 'less/!(bootstrap.less).less'], ['less']);
	gulp.watch([srcPath + 'less/bootstrap.less'], ['bootstrap']);
	gulp.watch([srcPath + 'imgs/sprite/*.*'], ['sprite']);
	gulp.watch([srcPath + 'imgs/**/*.*', '!' + srcPath + 'imgs/sprite/*.*'], ['images']);

	gulp.watch(['./*.html'], reload);

});



gulp.task('service', ['jq']);
gulp.task('default', ['serve','watch']);