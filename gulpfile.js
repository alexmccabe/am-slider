// Get gulp started
var gulp = require('gulp');

// Inject CSS and reload JS on change
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Auto-loading the plugins
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

var plumber = require('gulp-plumber');
var notify = require('gulp-notify');

// Directories
var input   = '/dev',
	output  = '/assets',
	sassDir = '/sass/',
	jsDir   = '/js/',
	imgDir  = '/img/',
	cssDir  = '/css/';

// Object to store source file locations
var sources = {
	sass : {
		src: '.' + input + sassDir,
		files: '.' + input + sassDir + '**/*.scss',
		dest: '.' + output + cssDir,
		map: '../../' + input + sassDir
	},

	js : {
		src: '.' + input + jsDir,
		files: ['.' + input + jsDir + '*.js', '.' + input + jsDir + '**/*.js'],
		dest: '.' + output + jsDir
	},

	images : {
		src: '.' + input + imgDir,
		files: '.' + input + imgDir + '**/*',
		dest: '.' + output + imgDir
	}
}

// Error handling function
var onError = function (err) {
	// beep([0, 0, 0]);
	// gutil.log(gutil.colors.green(err));

	notify({message: 'cheese'});

	console.log('error');
};

// Utility to log to the console
gulp.task('log', function() {
	console.log('hi');
});

// Utility to compile SASS
// gulp.task('styles', function() {
// 	return gulp.src(sources.sass.files)
// 		.pipe(plugins.plumber({
// 			errorHandler: onError
// 		}))
// 		.pipe(
// 			plugins.rubySass({
// 				lineNumbers: true,
// 				style: 'expanded',
// 				sourcemap: true,
// 				sourcemapPath: sources.sass.map
// 			})
// 		);
// });

gulp.task('styles', function () {
  return gulp.src(sources.sass.files)
    // .pipe(plumber({errorHandler: notify.onError("Error: there was an error")}))
    .pipe(
        plugins.rubySass({ style: 'expanded', debugInfo: true, lineNumbers: true })
    )
    .on("error", function(err) {
    	console.log('err.message');
    })

    .pipe(gulp.dest(sources.sass.dest));
});

gulp.task('js', function() {
	gulp.src(sources.js.files[0])
	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('default'))
		.pipe(plugins.jshint.reporter('fail'))
});


// Gulp install commands
// npm install gulp --save-dev

// npm install browser-sync gulp-autoprefixer gulp-cache gulp-clean gulp-concat gulp-filter gulp-imagemin gulp-jshint gulp-load-plugins gulp-minify-css gulp-notify gulp-plumber gulp-rename gulp-ruby-sass gulp-uglify --save-dev