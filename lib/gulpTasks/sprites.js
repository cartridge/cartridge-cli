/* ============================================================ *\
    SPRITES
\* ============================================================ */

var svgSpritesheet = require('gulp-svg-spritesheet');
var svg2png = require('gulp-svg2png');

module.exports = function(gulp, config) {

    gulp.task('sprites', function() {
        return gulp.src(config.paths.src.images + 'svgs/*.svg')
            .pipe(svgSpritesheet({
                cssPathNoSvg: '../' + config.dirs.images + '/sprite.png',
                cssPathSvg:   '../' + config.dirs.images + '/sprite.svg',
                padding:      5,
                pixelBase:    config.pixelBaseNoUnit,
                positioning:  'packed',
                templateSrc:  config.src + '/svg-sprite-sass.tpl',
                templateDest: config.paths.src.styles + '_tools/_tools.sprites.scss',
                units:        'em'
            }))
            .pipe(gulp.dest(config.paths.dest.images + 'sprite.svg'))
            .pipe(svg2png())
            .pipe(gulp.dest(config.paths.dest.images + 'sprite.png'));
    });

}