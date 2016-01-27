/* ============================================================ *\
    LOCAL TESTING
\* ============================================================ */

var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

module.exports = function(gulp, config) {

    gulp.task('browser-sync', function() {
        browserSync.init(null, {
            proxy: "http://localhost:3001",
            files: [config.dest + '/' +  '**/*.*'],
            browser: "google chrome",
            port: 7000,
            ui: {
                port: 7001
            }
        }, function browserSyncCallback() {
            console.log('browser-sync ready, listening on port: 7000')
        });
    });


    gulp.task('localServer', function(cb) {

        var started = false;

        //Reload website.js if templateData file changes (among other files)
        return nodemon({
            script: 'website.js',
            ext: 'js json'
        }).on('start', function() {
            if (!started) {
                cb();
                started = true;
            }
        });
    });

}