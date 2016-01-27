/* ============================================================ *\
    UNIT TESTING
\* ============================================================ */

var path = require('path');

var karmaServer = require('karma').Server

module.exports = function(gulp, config, argv) {

    gulp.task('tests', function(done) {
        var karmaReportsFromConfig = config.tests.reporters;
        var karmaReportersToUse = (argv.prod) ? karmaReportsFromConfig.production : karmaReportsFromConfig.dev;

        new karmaServer({
            configFile: path.resolve(__dirname, '..', config.tests.configFile),
            reporters: karmaReportersToUse
        }, done).start();
    });

}