var chalk = require('chalk');
var inquirer = require('inquirer');
var fs = require('fs-extra');
var path = require('path');
var extend = require('extend');

var fileTemplater = require('../fileTemplater')();
var promptOptions = require('../promptOptions')();

var _promptAnswers;

module.exports = function(appDir) {

    return {
        init: init
    };

    function init() {
        console.log('\n');
        console.log(chalk.bold('Running through setup for a new project.'));
        console.log(chalk.underline('This can be exited out by pressing [Ctrl+C]'));
        console.log('\n');

        inquirer.prompt(promptOptions.newOptions, inquirerCallback);
    }

    function getTemplateData() {
        return {
            projectNameFileName: _promptAnswers.projectName.toLowerCase().replace(/ /g,"-"),
        }
    }

    function inquirerCallback(answers) {
        _promptAnswers = answers;

        if(_promptAnswers.isOkToCopyFiles) {
            console.log('\n');
            console.log('> Copying over files...');

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
        console.log('> Templating files...');

        var templateData = extend({}, _promptAnswers, getTemplateData())

        fileTemplater.setTemplateData(templateData);
        fileTemplater.setFileList([
            path.join('_config', 'creds.json'),
            'package.json'
        ]);

        fileTemplater.run(function() {
            console.log('> Installation complete ✓');
            console.log('\n');
        });
    }
}