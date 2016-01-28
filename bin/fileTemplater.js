var fs = require('fs');
var path = require('path');
var template = require('lodash/template');

var _templateData;
var _fileList;
var _fileNumber = 1;
var _basePath = process.cwd();

module.exports = function() {

    return {
        run: run,
        setTemplateData: setTemplateData,
        setFileList: setFileList
    }

    function setTemplateData(templateData) {
        _templateData = templateData;
    }

    function setFileList(fileList) {
        _fileList = fileList;
    }

    function run(callback) {

        _fileList.forEach(function(element, index, array) {
            templateFile(element, callback);
        });

    }

    function templateFile(filePath, callback) {
        fs.readFile(path.join(_basePath, filePath), 'utf8', function(err, fileContents) {
            if (err) return console.error(err)

            var compiled = template(fileContents);
            var output = compiled(_templateData);

            fs.writeFile(path.join(process.cwd(), filePath), output, 'utf8', function(err) {
                if (err) return console.error(err)

                _fileNumber++;

                if(_fileNumber === _fileList.length) {
                    callback();
                }
            });

        });
    }

}