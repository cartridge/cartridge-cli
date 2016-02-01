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
        } else if(_options.verbose) {
            log.setLevel(log.levels.TRACE);
        } else {
            log.setLevel(log.levels.INFO);
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

            log.info('');
            log.info('> Copying over files...');

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

                    if(!needToCopyFile) {
                        log.debug('>', chalk.underline('Skipping path - ' + path));
                    } else {
                        log.debug('>', 'Copying path  -', path);
                    }

                    return needToCopyFile;
                }
            }, function (err) {
                if (err) return console.error(err);

                templateCopiedFiles();
            })

        } else {
            log.info('User cancelled - no files copied')
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
        log.debug('');
        log.info('> Templating files...');

        var templateData = extend({}, _promptAnswers, getTemplateData())

        fileTemplater.setConfig({
            data: templateData,
            basePath: process.cwd(),
            files: getTemplateFileList(),
            onEachFile: singleFileCallback,
            onCompleted: templateFinished
        })

        fileTemplater.run();
    }

    function getTemplateFileList() {
        var fileList = [];

        fileList.push(path.join('_config', 'creds.json'));
        fileList.push('package.json')
        fileList.push('.slaterc');

        return fileList;
    }

    function singleFileCallback(templateFilePath) {
        log.debug('> Templating file -', templateFilePath);
    }

    function templateFinished() {
        log.debug('');
        log.info('> Installation complete!');

        log.info('');
        log.info('Slate project "' + chalk.underline(_promptAnswers.projectName) +'" has been installed!');
        log.info('');
        log.info(chalk.underline('Next steps:'));
        log.info('  Run `npm install` to setup all dependencies');
        log.info('  Run `gulp` for initial setup, `gulp watch` to setup watching of files');
        log.info('');
    }
}