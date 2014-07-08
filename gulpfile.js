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
var gutil = require('gulp-util');

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
		map: './' + input + sassDir
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
var onError = function(err) {
	gutil.beep();
	console.log(err);
}

// Utility to log to the console
gulp.task('log', function() {
	console.log('hi');
});

// Utility to compile SASS
gulp.task('styles', function() {
	return gulp.src(sources.sass.files)
		.pipe(plugins.plumber({
			errorHandler: onError
		}))

		.pipe(
			plugins.rubySass({
				lineNumbers: true,
				style: 'expanded',
				sourcemap: true,
				sourcemapPath: sources.sass.map
			})
		)

		// Save a commented and indented version of the CSS
		.pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest(sources.sass.dest))

		// Minify the CSS file
		.pipe(plugins.rename({suffix: '.min'}))
		.pipe(plugins.minifyCss())
		.pipe(gulp.dest(sources.sass.dest))

		// Inject the CSS into the browser (browser-sync)
		.pipe(plugins.filter('**/*.css'))
		.pipe(reload({stream:true}));
});

// Utility to compile and minify JS
gulp.task('js', function() {
	gulp.src(sources.js.files[0])
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))

		// Check for errors
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('jshint-stylish', { verbose: true }))
		.pipe(plugins.jshint.reporter('fail'));

	gulp.src(sources.js.files[1])
		.pipe(plumber())
		.pipe(plugins.uglify())
		.pipe(plugins.concat('main.js'))
		.pipe(plugins.rename({suffix: '.min'}))
		.pipe(gulp.dest(sources.js.dest))
		.pipe(reload({stream:true, once: true}));

});

// Minify the images
gulp.task('images', function() {
	return gulp.src(sources.images.files)
		.pipe(
			plugins.cache(
				plugins.imagemin({
					optimizationLevel: 3,
					progressive: true,
					interlaced: true
				})
			)
		)
		.pipe(gulp.dest(sources.images.dest))
});

// Clean up the folders before we compile everything
gulp.task('clean', function() {
	return gulp.src([sources.sass.dest, sources.js.dest], {read: false})
		.pipe(plugins.clean());
});

gulp.task('browsersync', ['styles', 'js', 'images'], function() {
	var files = [
		sources.sass.dest + '/*.css',
		sources.js.dest + '/*.js',
		'./*.html'
	];

	browserSync.init(files, {
		server: {
			baseDir: '../js_slider'
		}
	});
});

gulp.task('default', ['clean'], function() {
	gulp.start('styles', 'js', 'images', 'browsersync');

	gulp.watch(sources.sass.files, ['styles'])
	.on('change', function(evt) {
		console.log(evt);
		console.log(
		'[watcher] File ' + evt.path.replace(/.*\/(?=sass)/,'') + ' was ' + evt.type + ', compiling...'
		);
	});

	gulp.watch(sources.js.files, ['js'])
	.on('change', function(evt) {
		console.log(evt);
		console.log(
		'[watcher] File ' + evt.path.replace(/.*\/(?=js)/,'') + ' was ' + evt.type + ', compiling...'
		);
	});
});


// Gulp install commands
// npm install gulp jshint-stylish browser-sync --save-dev

// npm install gulp-autoprefixer gulp-cache gulp-clean gulp-concat gulp-filter gulp-imagemin gulp-jshint gulp-load-plugins gulp-minify-css gulp-notify gulp-plumber gulp-rename gulp-ruby-sass gulp-uglify --save-dev