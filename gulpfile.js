var gulp = require('gulp'),
	sass = require('gulp-sass');

gulp.task('sass', function () {
	gulp.src('./src/styles/**/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dist/styles'));
});

gulp.task('default', ['sass']);