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
	return gulp.src('app/scss/*.scss')
		.pipe(sass()) //compile with libsass
		.pipe(gulp.dest('app/stylesheets')) //put it in stylesheets inside dist folder
		.pipe(rename({suffix: '.min'})) //add suffix
		.pipe(minifycss()) //minify the file
		.pipe(gulp.dest('app/stylesheets')) //again put it in the stylesheets
		.pipe(gzip(gzip_options)) //compress it
		.pipe(gulp.dest('app/stylesheets')) //and again
		.pipe(livereload()); //and watch for changes with livereload
});

// compile our js files
gulp.task('scripts', function(){
	return gulp.src([
			'**/foundation/js/vendor/jquery.js',
			'**/foundation/js/vendor/custom.modernizr.js',
			'**/foundation/js/vendor/zepto.js',
			'!**/foundation/js/foundation/index.js',
			'**/foundation/js/foundation/foundation.js',
			'**/foundation/js/foundation/*.js',
			'**/js/app.js'
		])
		.pipe(concat('main.js'))
		.pipe(gulp.dest('app/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'));
});

// watch files for changes
gulp.task('watch', function() {
	livereload.listen();
	gulp.watch('app/scss/*.scss', ['sass']); //watch scss files
	gulp.watch('app/js/app.js', ['scripts']); //watch app js files

	// trigger a live reload on any Django template changes
	// gulp.watch('**/templates/*').on('change', livereload.changed);
});

gulp.task('checkGulp', function(){
	return gutil.log('Gulp is running!');
});

gulp.task('default', ['checkGulp', 'sass', 'scripts', 'watch']);