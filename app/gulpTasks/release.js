/* ============================================================ *\
	PACKAGE THE FOLDER UP
\* ============================================================ */

var zip = require('gulp-zip');

module.exports = function(gulp, config, argv, creds) {

	gulp.task('package-release', function () {

		var d = new Date();
		var packageName = creds.packageName + '' + d.getDay() + '.' + d.getMonth() + '.' + d.getFullYear() + '_' + d.getHours() + '.' + d.getMinutes();

		return gulp.src('build/**/*')
			.pipe(zip(packageName + '.zip'))
			.pipe(gulp.dest('release'));
	});

}