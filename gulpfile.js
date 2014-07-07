// npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-clean gulp-notify gulp-rename gulp-cache gulp-load-plugins --save-dev

var gulp = require('gulp');

// Auto-loading the plugins
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

gulp.task('default', function() {

});

// A display error function, to format and make custom errors more uniform
// Could be combined with gulp-util or npm colors for nicer output
var displayError = function(error) {

	// Initial building up of the error
	var errorString = '[' + error.plugin + ']';
	errorString += ' ' + error.message.replace("\n",''); // Removes new line at the end

	// If the error contains the filename or line number add it to the string
	if(error.fileName)
	errorString += ' in ' + error.fileName;

	if(error.lineNumber)
	errorString += ' on line ' + error.lineNumber;

	// This will output an error like the following:
	// [gulp-sass] error message in file_name on line 1
	console.error(errorString);
}


// Compiling the SASS and Compass styles
gulp.task('styles', function() {
	return gulp.src('dev/sass/main.scss')
		// Compile SASS
		.pipe(plugins.rubySass({style: 'expanded'}))

		// If there is an error, don't stop compiling but use the custom displayError function
		.on('error', function(err){
			displayError(err);
		})
		.pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('assets/css'))

		// Minify the CSS file
		.pipe(plugins.rename({suffix: '.min'}))
		.pipe(plugins.minifyCss())
		.pipe(gulp.dest('assets/css'))

		.pipe(plugins.notify({message: 'Styles task complete'}));
});

