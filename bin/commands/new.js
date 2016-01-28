var chalk = require('chalk');
var inquirer = require('inquirer');
var fs = require('fs-extra');
var path = require('path');
var extend = require('extend');

var fileTemplater = require('../fileTemplater')();
var promptOptions = require('../promptOptions')();

var _projectName;
var _promptAnswers;

module.exports = function(appDir) {

    return {
        init: init
    };

    function init(name) {
        _projectName = name;
        console.log('Creating a new project: %s', chalk.underline(_projectName));
        inquirer.prompt(promptOptions.newOptions, inquirerCallback);
    }

    function getTemplateData() {
        return {
            projectName: _projectName,
            projectNameFileName: _projectName.toLowerCase().replace(/ /g,"-"),
        }
    }

    function inquirerCallback(answers) {
        _promptAnswers = answers;

        if(_promptAnswers.isOkToCopyFiles) {
            console.log('copying over files...');

            fs.copy(appDir, process.cwd(), {
                filter: function(path) {
                    return path.indexOf("node_modules") === -1;
                }
            }, function (err) {
                if (err) return console.error(err)

                templateCopiedFiles();
            })

        } else {
            console.log('User cancelled - no files copied')
        }
    }

    function templateCopiedFiles() {
        var templateData = extend({}, _promptAnswers, getTemplateData())

        fileTemplater.setTemplateData(templateData);
        fileTemplater.setFileList(['_config/creds.json', 'package.json']);

        fileTemplater.run(function() {
            console.log('hits templater callback');
        });
    }
}