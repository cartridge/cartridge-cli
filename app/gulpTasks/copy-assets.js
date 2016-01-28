/* ============================================================ *\
    MOVE / Copy files
\* ============================================================ */

module.exports = function(gulp, config) {
    gulp.task('copy:fonts', function(){
        return gulp.src([config.paths.src.fonts + '**/*'])
        .pipe(gulp.dest(config.paths.dest.fonts));
    })

    gulp.task('copy', function(){
        return gulp.src(['!' + config.paths.dest.styles, '!' + config.paths.dest.styles + '*.map', config.dest + '/**/*'])
        .pipe(gulp.dest(config.build));
    })
}