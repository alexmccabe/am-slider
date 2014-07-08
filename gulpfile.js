// npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-clean gulp-notify gulp-rename gulp-cache gulp-load-plugins --save-dev

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Auto-loading the plugins
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

// Object to store all file paths
var sources = {
	sass : {
		src: './dev/sass/',
		files: './dev/sass/**/*.scss',
		dest: './assets/css'
	},

	js : {
		src: './dev/js/',
		files: ['./dev/js/*.js', './dev/js/**/*.js'],
		dest: './assets/js'
	},

	images : {
		src: './dev/img/',
		files: './dev/img/**/*',
		dest: './assets/img'
	}
}

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

gulp.task('log', function() {
	console.log(sources.js.files[0]);
});


// Compiling the SASS and Compass styles
gulp.task('styles', function() {
	return gulp.src(sources.sass.files)
		// Compile SASS
		.pipe(plugins.rubySass({
			lineNumbers: true,
			style: 'expanded',
			sourcemap: true,
			sourcemapPath: '../../dev/sass'
		}))

		// If there is an error, don't stop compiling but use the custom displayError function
		.on('error', function(err){
			displayError(err);
		})
		.pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest(sources.sass.dest))

		// Minify the CSS file
		.pipe(plugins.rename({suffix: '.min'}))
		.pipe(plugins.minifyCss())
		.pipe(gulp.dest(sources.sass.dest))
		.pipe(reload({stream:true}))

		.pipe(plugins.notify({message: 'Styles task complete'}));
});

gulp.task('js', function() {
	gulp.src(sources.js.files[0])
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('default'))
		.on('error', function(err){
			displayError(err);
		});

	gulp.src(sources.js.files[1])
		.pipe(plugins.uglify())
		.pipe(plugins.concat('main.js'))
		.pipe(plugins.rename({suffix: '.min'}))
		.pipe(gulp.dest(sources.js.dest))
		.pipe(plugins.notify({message: 'JS task complete'}));;
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

		.pipe(plugins.notify({message: 'Images task complete'}));
});

// Clean up the folders before we compile everything
gulp.task('clean', function() {
	return gulp.src([sources.sass.dest, sources.js.dest, sources.images.dest], {read: false})
		.pipe(plugins.clean());
});


gulp.task('browsersync', function() {
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

gulp.task('default', ['clean', 'browsersync'], function() {
	gulp.start('styles', 'js', 'images');

	gulp.watch(sources.sass.files, ['styles'])
	.on('change', function(evt) {
		console.log(
		'[watcher] File ' + evt.path.replace(/.*(?=sass)/,'') + ' was ' + evt.type + ', compiling...'
		);
	});

	gulp.watch(sources.js.files, ['js'])
	.on('change', function(evt) {
		console.log(
		'[watcher] File ' + evt.path.replace(/.*(?=js)/,'') + ' was ' + evt.type + ', compiling...'
		);
	});
});