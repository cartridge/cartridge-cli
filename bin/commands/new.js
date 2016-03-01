"use strict";

var chalk    = require('chalk');
var inquirer = require('inquirer');
var fs       = require('fs-extra');
var path     = require('path');
var extend   = require('extend');
var npmInstallPackage = require('npm-install-package')
var inArray = require('in-array');

var utils = require('../utils');
var fileTemplater = require('../fileTemplater')();
var promptOptions = require('../promptOptions')();
var pkg           = require(path.resolve(__dirname, '..', '..' ,'package.json'));

var _log;
var _promptAnswers;
var _options;

module.exports = function(appDir) {

	return {
		init: init
	};

	function init(options) {
		_options = options;
		_log = utils.getLogInstance(_options);
		checkIfWorkingDirIsEmpty();
	}

	function checkIfWorkingDirIsEmpty() {
		fs.readdir(process.cwd(), function(err, files) {
			if (err) return console.error(err);

			if(getWorkingDirFilteredList(files).length) {
				_log.warn('');
				_log.warn(chalk.red('Warning: The directory you are currently in is not empty!'));
				_log.warn(chalk.red('Going through the setup will perform a clean slate installation.'));
				_log.warn(chalk.red('This will overwrite any user changes'));
				_log.warn('');

			} else {
				_log.warn('');
				_log.warn(chalk.bold('Running through setup for a new project.'));
				_log.warn(chalk.bold('This can be exited out by pressing [Ctrl+C]'));
				_log.warn('');
			}

			_log.warn(chalk.bold('Make sure you are running this command in the folder you want all files copied to'));
			_log.warn('');

			initOnScreenPrompts();
		})
	}

	function getWorkingDirFilteredList(unfilteredFileList) {
		var filesToExclude = ['.DS_Store'];
		var filteredDirContents = [];

		for (var i = 0; i < unfilteredFileList.length; i++) {
			//if the file / folder IS NOT part of the exclude list, then add it to the filtered dir content list
			if(!inArray(filesToExclude, unfilteredFileList[i])) {
				filteredDirContents.push(unfilteredFileList[i]);
			}
		}

		return filteredDirContents;
	}

	function initOnScreenPrompts() {
		promptOptions
			.getNewCommandPromptOptions()
		 	.then(function(promptOptions) {
		 		console.log('');
		 		inquirer.prompt(promptOptions, promptCallback);
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

	function promptCallback(answers) {
		_promptAnswers = answers;

		if(_promptAnswers.isOkToCopyFiles) {

			_log.info('');
			_log.info('Copying over files...');

			fs.copy(appDir, process.cwd(), {
				filter: fileCopyFilter
			}, fileCopyComplete)

		} else {
			_log.info('User cancelled - no files copied')
		}
	}

	function fileCopyFilter(path) {
		var needToCopyFile = true;
		var filesDirsToExclude = getExcludeList();

		for (var i = 0; i < filesDirsToExclude.length; i++) {
			//Check if needToCopyFile is still true and
			//hasn't been flipped during loop
			if(needToCopyFile) {
				needToCopyFile = path.indexOf(filesDirsToExclude[i]) === -1;
			}
		};

		if(!needToCopyFile) {
			_log.debug(chalk.underline('Skipping path - ' + path));
		} else {
			_log.debug('Copying path  -', path);
		}

		return needToCopyFile;
	}

	function fileCopyComplete(err) {
		if (err) return console.error(err);

		templateCopiedFiles();
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
		_log.debug('');
		_log.info('Templating files...');

		var templateData = extend({}, _promptAnswers, getTemplateData())

		fileTemplater.setConfig({
			data: templateData,
			basePath: process.cwd(),
			files: getTemplateFileList(),
			onEachFile: singleFileCallback,
			onCompleted: installNpmPackages
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
		_log.debug('Templating file -', templateFilePath);
	}

	function installNpmPackages() {
		npmInstallPackage(_promptAnswers.slateModules, { saveDev: true}, function(err) {
			if (err) throw err;

			finishSetup();
		})
	}

	function finishSetup() {
		_log.info('');
		_log.info(chalk.green('Setup complete!'));
		_log.info('Slate project ' + chalk.yellow(_promptAnswers.projectName) + ' has been installed!');
		_log.info('');
		_log.info('Final steps:');
		_log.info(' · Run ' + chalk.yellow('gulp') + ' for initial setup of styles and scripts.');
		_log.info(' · Run ' + chalk.yellow('gulp watch') + ' to setup watching of files');
		_log.info('');
	}
}
