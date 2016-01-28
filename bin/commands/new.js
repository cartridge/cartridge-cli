var chalk = require('chalk');
var inquirer = require('inquirer');
var fs = require('fs-extra');
var path = require('path');
var titleize = require('titleize');
var extend = require('extend');

var fileTemplater = require('../fileTemplater')();

var _projectName;
var _promptAnswers;

var PROMPT_OPTIONS = [{
    type: "input",
    name: "projectAuthor",
    message: "Who is the author of the project?",
    validate: function(value) {
        var isValid = (value !== "");

        if(isValid) {
            return true;
        } else {
            return "Author cannot be empty"
        }

    },
    filter: function(value) {
        return titleize(value);
    }
}, {
    type: "input",
    name: "projectDescription",
    message: "What is the project description?",
    default: function () { return ""; }
},{
    type: "confirm",
    name: "isOkToCopyFiles",
    message: "Copying over files to current directory. Press enter to confirm",
    default: true 
}]

module.exports = function(appDir) {

    return {
        init: init
    };

    function init(name) {
        _projectName = name;
        console.log('Creating a new project: %s', chalk.underline(_projectName));
        inquirer.prompt(PROMPT_OPTIONS, inquirerCallback);
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