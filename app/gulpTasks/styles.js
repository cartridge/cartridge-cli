'use strict';
/* ============================================================ *\
    STYLES / SCSS
\* ============================================================ */

// Gulp dependencies
var sourcemaps      = require('gulp-sourcemaps');
var gulpif          = require('gulp-if')
var rename          = require('gulp-rename');

// Sass dependencies
var sgc             = require('gulp-sass-generate-contents');
var sass            = require('gulp-sass');

// CSS dependencies
var autoprefixer    = require('autoprefixer');
var postcss         = require('gulp-postcss');
var pixrem          = require('pixrem');
var cssNano         = require('cssnano');
var mqPacker        = require('css-mqpacker');

// Config
var creds           = require('../_config/creds.json');
var itcss           = require('../_config/itcss');

var stylesConfig = {
    browsers: {
        normal: ['> 5%', 'Android 3'],
        ie8:    ['IE 8']
    }
};

module.exports = function(gulp, config, argv) {

    var sassConfig = {
        errLogToConsole: true,
        includePaths:    [config.paths.src.components],
        outputStyle:     'compact'
    };

    function getPostCssPlugins(browsers) {
        var plugins = [
            autoprefixer({
                browsers: browsers
            }),
            pixrem({
                rootValue: config.pixelBase
            }),
            mqPacker({
            	sort: true
            })
        ];

        if(argv.prod) {
            plugins.push(cssNano());
        }

        return plugins;
    }

    gulp.task('sass-generate-contents', function () {
        return gulp.src(itcss())
            .pipe(sgc(config.paths.src.styles + 'main.scss', creds))
            .pipe(gulp.dest(config.paths.src.styles));
    });

    gulp.task('sass', ['sprites'],function () {
        return gulp.src(config.paths.src.styles + 'main.scss')
            .pipe(gulpif(!argv.prod, sourcemaps.init())) //Default only
            .pipe(sass(sassConfig))
            .pipe(postcss(getPostCssPlugins(stylesConfig.browsers.normal)))
            .pipe(gulpif(!argv.prod, sourcemaps.write('.'))) //Default only
            .pipe(gulp.dest(config.paths.dest.styles));
    });

    gulp.task('sass:legacy:ie8', ['sprites'] ,function () {
        return gulp.src(config.paths.src.styles + 'ie8.scss')
            .pipe(sass(sassConfig))
            .pipe(postcss(getPostCssPlugins(stylesConfig.browsers.ie8)))
            .pipe(gulp.dest(config.paths.dest.styles));
    });

}
