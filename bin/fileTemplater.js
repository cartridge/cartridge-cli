"use strict";

var fs = require('fs');
var path = require('path');
var template = require('lodash/template');

var _fileNumber = 1;
var _config = {};

module.exports = function() {

    return {
        run: run,
        setConfig: setConfig
    }

    function setConfig(config) {
        _config = config;
    }

    function run(callback) {
        _config.files.forEach(function(element, index, array) {
            templateFile(element, callback);
        });
    }

    function templateFile(filePath, callback) {
        fs.readFile(path.join(_config.basePath, filePath), 'utf8', function(err, fileContents) {
            if (err) return console.error(err)

            var compiled = template(fileContents);
            var output = compiled(_config.data);

            fs.writeFile(path.join(_config.basePath, filePath), output, 'utf8', function(err) {
                if (err) return console.error(err)

                _fileNumber++;

                if(_fileNumber === _config.files.length) {
                    callback();
                }
            });

        });
    }

}