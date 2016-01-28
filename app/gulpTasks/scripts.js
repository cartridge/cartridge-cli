'use strict';

/* ============================================================ *\
    SCRIPTS JS / lint, concat and minify scripts
\* ============================================================ */

// Gulp dependencies
var sourcemaps   = require('gulp-sourcemaps');
var gulpif       = require('gulp-if')
var concat       = require('gulp-concat');

// JavaScript dependencies
var jshint       = require('gulp-jshint');
var uglify       = require('gulp-uglify');

// Config
var jshintConfig = require('../_config/jshint.json');

module.exports = function(gulp, config, argv) {

    gulp.task('scripts', function(){
        return gulp.src([config.paths.src.scripts + '**/*.js'])
            .pipe(gulpif(!argv.prod, jshint(jshintConfig))) //Default only
            .pipe(gulpif(!argv.prod, sourcemaps.init())) //Default only
            .pipe(concat('bundle.js'))
            .pipe(gulpif(argv.prod, uglify())) //Production only
            .pipe(gulpif(!argv.prod, sourcemaps.write('.'))) //Default only
            .pipe(gulp.dest(config.paths.dest.scripts));
    });

    gulp.task('scripts:vendor', function(){
        return gulp.src([config.paths.src.scripts + 'vendor/*.js'])
            .pipe(gulpif(!argv.prod, jshint(jshintConfig))) //Default only
            .pipe(gulpif(!argv.prod, sourcemaps.init())) //Default only
            .pipe(concat('bundle-critical.js'))
            .pipe(gulpif(argv.prod, uglify())) //Production only
            .pipe(gulpif(!argv.prod, sourcemaps.write('.'))) //Default only
            .pipe(gulp.dest(config.paths.dest.scripts));
    });

    gulp.task('scripts:ie', function(){
        return gulp.src([config.paths.src.scripts + 'ie/*.js'])
            .pipe(concat('ie.js'))
            .pipe(gulpif(argv.prod, uglify())) //Production only
            .pipe(gulp.dest(config.paths.dest.scripts));
    });

}