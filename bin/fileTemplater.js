"use strict";

var fs = require('fs');
var path = require('path');
var extend = require('extend');
var template = require('lodash/template');

var errorHandler = require('./errorHandler');

var _fileNumber = 1;
var _defaultConfig = {
    onEachFile: function() {},
    onCompleted: function() {}
}

var _config;

var fileTemplaterApi = {};

/**
 * Run file templating
 */
fileTemplaterApi.run = function() {
    _config.files.forEach(function(element, index, array) {
        templateFile(element);
    });
}

/**
 * Sets internal config object
 */
fileTemplaterApi.setConfig = function(config) {
    _config = extend(_defaultConfig, config);
}

/**
 * Template a single file.
 * Get the contents of a file, template it and re-write to the same file
 * @param  {Object} templateFileConfig Config data, containing template file config
 */
function templateFile(templateFileConfig) {
    var compiled;
    var output;

    fs.readFile(templateFileConfig.src, 'utf8', function(err, fileContents) {
        if (err) errorHandler(err);

        compiled = template(fileContents);
        output = compiled(_config.data);

        fs.writeFile(templateFileConfig.dest, output, 'utf8', function(err) {
            if (err) errorHandler(err);

            _config.onEachFile(templateFileConfig.dest);

            if(templateFileConfig.deleteSrcFile) {
              fs.unlinkSync(templateFileConfig.src);
            }

            if(_fileNumber === _config.files.length) {
                _config = _defaultConfig;
                _config.onCompleted();
            }

            _fileNumber++;

        });

    });
}

module.exports = fileTemplaterApi;
