"use strict";

var chalk = require('chalk');
var inquirer = require('inquirer');
var fs = require('fs-extra');
var path = require('path');
var extend = require('extend');

var fileTemplater = require('../fileTemplater')();
var promptOptions = require('../promptOptions')();
var pkg = require(path.resolve(__dirname, '..', '..' ,'package.json'));

var _promptAnswers;

module.exports = function(appDir) {

    return {
        init: init
    };

    function init() {
        checkIfWorkingDirIsEmpty();
    }

    function checkIfWorkingDirIsEmpty() {
        fs.readdir(process.cwd(), function(err, files) {
            if (err) return console.error(err);

            if(files.length > 1) {
                console.log('\n');
                console.log(chalk.underline('Warning: The directory you are currently in is not empty!'));
                console.log(chalk.underline('Going through the setup will perform a clean slate installation.'));
                console.log(chalk.underline('This will overwrite any user changes'));
                console.log('\n');

                inquirer.prompt(promptOptions.newOptions, inquirerCallback);
            } else {
                console.log('\n');
                console.log(chalk.bold('Running through setup for a new project.'));
                console.log(chalk.underline('This can be exited out by pressing [Ctrl+C]'));
                console.log('\n');

                inquirer.prompt(promptOptions.newOptions, inquirerCallback);
            }
        })
    }

    function getTemplateData() {
        var date = new Date();

        return {
            projectNameFileName: _promptAnswers.projectName.toLowerCase().replace(/ /g,"-"),
            projectGeneratedDate: [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/'),
            slateCurrentVersion: pkg.version
        }
    }ß

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
                if (err) return console.error(err);

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
            'package.json',
            '.slaterc'
        ]);

        fileTemplater.run(templateFinished);
    }

    function templateFinished() {
        console.log('> Installation complete ✓');

        console.log('\n');
        console.log('You\'re nearly there!');
        console.log(chalk.underline('Next steps:'));
        console.log('  Run  `npm install` to setup all dependencies');
        console.log('  Run `gulp` for initial setup, `gulp watch` to setup and forget about the build');
        console.log('\n');
    }
}