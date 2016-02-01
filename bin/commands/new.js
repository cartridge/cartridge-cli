"use strict";

var chalk = require('chalk');
var inquirer = require('inquirer');
var fs = require('fs-extra');
var path = require('path');
var extend = require('extend');
var log = require('loglevel');

var fileTemplater = require('../fileTemplater')();
var promptOptions = require('../promptOptions')();
var pkg = require(path.resolve(__dirname, '..', '..' ,'package.json'));

var _currentWorkingDir = process.cwd();
var _promptAnswers;
var _options;

module.exports = function(appDir) {

    return {
        init: init
    };

    function init(options) {
        _options = options;
        setUpLogLevel();
        checkIfWorkingDirIsEmpty();
    }

    function setUpLogLevel() {
        if(_options.silent) {
            log.setLevel(log.levels.SILENT);
        } else {
            log.setLevel(log.levels.WARN);
        }
    }

    function checkIfWorkingDirIsEmpty() {
        fs.readdir(_currentWorkingDir, function(err, files) {
            if (err) return console.error(err);

            if(files.length > 1) {
                log.warn('');
                log.warn(chalk.underline('Warning: The directory you are currently in is not empty!'));
                log.warn(chalk.underline('Going through the setup will perform a clean slate installation.'));
                log.warn(chalk.underline('This will overwrite any user changes'));
                log.warn('');

                inquirer.prompt(promptOptions.newOptions, inquirerCallback);
            } else {
                log.warn('');
                log.warn(chalk.bold('Running through setup for a new project.'));
                log.warn(chalk.underline('This can be exited out by pressing [Ctrl+C]'));
                log.warn('');

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
    }

    function inquirerCallback(answers) {
        _promptAnswers = answers;

        if(_promptAnswers.isOkToCopyFiles) {
            var filesDirsToExclude = getExcludeList();

            log.warn('');
            log.warn('> Copying over files...');

            fs.copy(appDir, process.cwd(), {
                filter: function(path) {
                    var needToCopyFile = true;

                    for (var i = 0; i < filesDirsToExclude.length; i++) {
                        //needToCopyFile is still true
                        //Hasn't been flipped during loop
                        if(needToCopyFile) {
                            needToCopyFile = path.indexOf(filesDirsToExclude[i]) === -1;
                        }
                    };

                    return needToCopyFile;
                }
            }, function (err) {
                if (err) return console.error(err);

                templateCopiedFiles();
            })

        } else {
            log.warn('User cancelled - no files copied')
        }
    }

    function getExcludeList() {
        //Default exclude folders / files
        var excludeList = [
            'node_modules'
        ];

        if(_promptAnswers.projectType === "Dot NET") {
            excludeList.push('views');
            excludeList.push('release.js');
        }

        return excludeList;
    }

    function templateCopiedFiles() {
        log.warn('> Templating files...');

        var templateData = extend({}, _promptAnswers, getTemplateData())

        fileTemplater.setTemplateData(templateData);
        fileTemplater.setBasePath(process.cwd());
        fileTemplater.setFileList([
            path.join('_config', 'creds.json'),
            'package.json',
            '.slaterc'
        ]);

        fileTemplater.run(templateFinished);
    }

    function templateFinished() {
        log.warn('> Installation complete!');

        log.warn('');
        log.warn('Slate project "' + chalk.underline(_promptAnswers.projectName) +'" has been installed!');
        log.warn('');
        log.warn(chalk.underline('Next steps:'));
        log.warn('  Run `npm install` to setup all dependencies');
        log.warn('  Run `gulp` for initial setup, `gulp watch` to setup watching of files');
        log.warn('');
    }
}