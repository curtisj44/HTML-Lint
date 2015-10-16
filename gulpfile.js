var gulp = require('gulp'),

	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	sass = require('gulp-sass');

gulp.task('styles', function () {
	gulp.src('./src/styles/**/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 5 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('scripts', function () {
	gulp.src('./src/scripts/**/*.js')
		.pipe(concat('htmlLint.js'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['scripts', 'styles']);