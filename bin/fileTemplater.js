var fs = require('fs');
var path = require('path');
var template = require('lodash/template');

var _templateData;

var FILES = ['creds.json']

module.exports = function() {

    return {
        run: run,
        setTemplateData: setTemplateData
    }

    function setTemplateData(templateData) {
        _templateData = templateData;
    }

    function run(callback) {
        fs.readFile(path.join(process.cwd(), '_config', 'creds.json'), 'utf8', function(err, fileContents) {
            if (err) return console.error(err)

            var compiled = template(fileContents);
            var output = compiled(_templateData);

            fs.writeFile(path.join(process.cwd(), '_config', 'creds.json'), output, 'utf8', function(err) {
                if (err) return console.error(err)

                console.log("success! - files copied");
                callback();
            });

        });
    }

}