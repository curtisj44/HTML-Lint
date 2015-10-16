var gulp = require('gulp'),

	autoprefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass');

gulp.task('sass', function () {
	gulp.src('./src/styles/**/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 5 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('./dist/styles'));
});

gulp.task('default', ['sass']);