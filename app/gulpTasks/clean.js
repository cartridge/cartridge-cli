/* ============================================================ *\
    CLEAN
\* ============================================================ */

var zip = require('gulp-zip');
var del = require('del');

module.exports = function(gulp, config, argv, creds) {

    gulp.task('clean', function () {
        return del([
            './public/',
            './build/'
        ]);
    });

}