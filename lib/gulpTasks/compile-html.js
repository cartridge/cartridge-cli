/* ============================================================ *\
    COMPILE TEMPLATES / HTML
\* ============================================================ */

var rename = require('gulp-rename');
var handlebars = require('gulp-compile-handlebars');

var handlebarsConfig = require('../_config/handlebars.json');
var templateDataJson = require('../_config/templateData.json');
var templateHelpers = require('../_config/templateHelpers.js')();

module.exports = function(gulp) {

    gulp.task('compile-html', function () {
        var templateData = {
            data: templateDataJson
        },

        options = {
            batch : handlebarsConfig.partials,
            helpers: templateHelpers
        }
        
        return gulp.src(handlebarsConfig.views)
            .pipe(handlebars(templateData, options))
            .pipe(rename({extname: '.html'}))
            .pipe(gulp.dest('build'));
    });

}