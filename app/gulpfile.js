/* ============================================================ *\
    SETUP
\* ============================================================ */

/*jslint node: true */
'use strict';

//Node
var path       = require('path');
var fs         = require('fs');

// Gulp
var gulp       = require('gulp');
var argv       = require('yargs').argv;
var runSeq     = require('run-sequence');

// Config
var config     = require('./_config/project.json');
var creds      = require('./_config/creds.json');

config.paths   = require('./_config/paths')(config);

/* ============================================================ *\
    TASK MODULES
\* ============================================================ */

var gulpTasksDir = path.join(__dirname, 'gulpTasks');

fs.readdirSync(gulpTasksDir).forEach(function(file) {
  require("./gulpTasks/" + file)(gulp, config, argv, creds);
});

// fs.readdir(gulpTasksDir, function(err, files) {
// 	if (err) return console.error(err)

// 	files.forEach(function(f, index, array) {
// 		require('./gulpTasks/' + element);
// 		console.log('file ->', element);
// 	})

// })

// require('./gulpTasks/styles.js')(gulp, config, argv);
// require('./gulpTasks/scripts.js')(gulp, config, argv);
// require('./gulpTasks/sprites.js')(gulp, config);
// require('./gulpTasks/image-minify.js')(gulp, config, argv);
// require('./gulpTasks/copy-assets.js')(gulp, config);
// require('./gulpTasks/release.js')(gulp, creds);
// require('./gulpTasks/compile-html.js')(gulp);
// require('./gulpTasks/local-testing.js')(gulp, config);
// require('./gulpTasks/unit-testing.js')(gulp, config, argv);
// require('./gulpTasks/new-component.js')(gulp, argv);

/* ============================================================ *\
	MAIN TASKS
\* ============================================================ */

gulp.task('watch:sass', function () {
	if(!argv.prod) {
		gulp.watch(
			[config.paths.src.styles + '/**/*.scss', config.paths.src.components + '/**/*.scss'],
			['sass']
		);
	}
});

gulp.task('watch:js', function () {
	if(!argv.prod) {
		gulp.watch(
			[config.paths.src.scripts + '/**/*.js', config.paths.src.components + '/**/*.js'],
			['tests', 'scripts']
		);
	}
});

gulp.task('watch:sprites', function () {
	if(!argv.prod) {
		gulp.watch(
			[config.paths.src.images + '/svgs/*.svg'],
			['sprites']
		);
	}
});

gulp.task('component', function(cb) {
	runSeq(['new-component'], cb);
})

gulp.task('watch', function (cb) {
	runSeq(['watch:sass', 'watch:js', 'watch:sprites'], cb);
});

gulp.task('build', function (cb) {
	runSeq(['default'], ['copy'], ['compile-html'],  cb);
});

gulp.task('release', function (cb) {
	runSeq(['build'], ['package-release'],  cb);
});

gulp.task('serve', function(cb) {
	runSeq(['localServer'], ['browser-sync'], cb);
});

gulp.task('dev', function(cb) {
	runSeq(['default'], ['watch', 'serve'], cb);
});

gulp.task('default', function (cb) {
	runSeq(['clean'],['sass-generate-contents'],['sass', 'scripts','scripts:vendor' ,'scripts:ie' ,'copy:fonts', 'imagemin'], ['sass:legacy:ie8'], ['tests'], cb);
});
