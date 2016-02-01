"use strict";

var fs = require('fs');
var path = require('path');
var extend = require('extend');
var template = require('lodash/template');

var _fileNumber = 1;
var _config = {
    onEachFile: function() {},
    onCompleted: function() {}
};

module.exports = function() {

    return {
        run: run,
        setConfig: setConfig
    }

    function setConfig(config) {
        _config = extend(_config, config);
    }

    function run(callback) {
        _config.files.forEach(function(element, index, array) {
            templateFile(element);
        });
    }

    function templateFile(filePath) {
        var filePath = path.join(_config.basePath, filePath);
        var compiled;
        var output;

        fs.readFile(filePath, 'utf8', function(err, fileContents) {
            if (err) return console.error(err)

            compiled = template(fileContents);
            output = compiled(_config.data);

            fs.writeFile(filePath, output, 'utf8', function(err) {
                if (err) return console.error(err)

                _config.onEachFile(filePath);

                if(_fileNumber === _config.files.length) {
                    _config.onCompleted();
                }

                _fileNumber++;

            });

        });
    }

}