var gulp = require('gulp'),

	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	sass = require('gulp-sass');
	// uglify = require('gulp-sass');

gulp.task('styles', function () {
	gulp.src('./src/styles/**/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 5 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('./dist/styles'));
});

gulp.task('scripts', function () {
	gulp.src('./src/scripts/**/*.js')
		.pipe(concat('html-lint.js'))
		// .pipe(gulp.dest('./dist/scripts/'))
		// .pipe(uglify())
		// .pipe(uglify({ mangle: { toplevel: true } })
		// 	.on('error', gulpUtil.log))
		// .pipe(rename({
		// 	suffix: '.min'
		// }))
		.pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('default', ['scripts', 'styles']);