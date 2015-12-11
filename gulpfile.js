var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var gzip = require('gulp-gzip');
var livereload = require('gulp-livereload');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var gzip_options = {
	threshold: '1kb',
	gzipOptions: {
		level: 9
	}
};

// compile our sass
gulp.task('sass', function() {
	return gulp.src('scss/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('dist/stylesheets'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('dist/stylesheets'))
		.pipe(gzip(gzip_options))
		.pipe(gulp.dest('dist/stylesheets'))
		.pipe(livereload());
});

// compile our js files
gulp.task('scripts', function(){
	return gulp.src([
			'bower_components/foundation/js/foundation.js',
			'bower_components/foundation/js/vendor/*.js',
			'dev/js/app.js'
		])
		.pipe(concat('main.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

// watch files for changes
gulp.task('watch', function() {
	livereload.listen();
	gulp.watch('scss/*.scss', ['sass']); //watch scss files
	gulp.watch('dev/js/*.js', ['scripts']); //watch dev js files

	// trigger a live reload on any Django template changes
	// gulp.watch('**/templates/*').on('change', livereload.changed);
});

gulp.task('checkGulp', function(){
	return gutil.log('Gulp is running!');
});

gulp.task('default', ['checkGulp', 'sass', 'scripts', 'watch']);