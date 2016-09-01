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

    fs.readFile(templateFileConfig.src, 'utf8', function readFileCallback(err, fileContents) {
        if (err) errorHandler(err);

        compiled = template(fileContents);
        output = compiled(_config.data);

        writeTemplatedContents(templateFileConfig, output);
    });
}

/**
 * Write compiled result to destination file
 * @param  {Object} fileConfig     Individual file config object
 * @param  {String} compiledOutput The compiled output from the template file
 */
function writeTemplatedContents(fileConfig, compiledOutput) {
  fs.writeFile(fileConfig.dest, compiledOutput, 'utf8', function writeFileCallback(err) {
      if (err) errorHandler(err);

      _config.onEachFile(fileConfig.dest);

      if(fileConfig.deleteSrcFile) {
        fs.unlinkSync(fileConfig.src);
      }

      if(_fileNumber === _config.files.length) {
          _config = _defaultConfig;
          _config.onCompleted();
      }

      _fileNumber++;

  });
}

module.exports = fileTemplaterApi;
