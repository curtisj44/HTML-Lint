var gulp = require('gulp'),

	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	del = require('del'),
	minifier = require('gulp-minifier'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass');

gulp.task('clean', function () {
	// del.sync('./dist/**');
});

gulp.task('minify', function () {
	gulp
		.src('./dist/*')
		.pipe(minifier({
			minify: true,
			collapseWhitespace: true,
			conservativeCollapse: true,
			minifyJS: true,
			minifyCSS: true
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('scripts', function () {
	gulp
		.src('./src/scripts/**/*.js')
		.pipe(concat('htmlLint.js'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('styles', function () {
	gulp
		.src('./src/styles/**/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 5 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['clean', 'scripts', 'styles', 'minify']);
