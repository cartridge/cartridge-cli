"use strict";

var chalk    = require('chalk');
var inquirer = require('inquirer');
var fs       = require('fs-extra');
var path     = require('path');
var extend   = require('extend');
var log      = require('loglevel');
var npm = require('npm');
var inArray = require('in-array');

var fileTemplater = require('../fileTemplater')();
var promptOptions = require('../promptOptions')();
var pkg           = require(path.resolve(__dirname, '..', '..' ,'package.json'));

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
		fs.readdir(process.cwd(), function(err, files) {
			if (err) return console.error(err);

			if(getWorkingDirFilteredList(files).length) {
				log.warn('');
				log.warn(chalk.red('Warning: The directory you are currently in is not empty!'));
				log.warn(chalk.red('Going through the setup will perform a clean slate installation.'));
				log.warn(chalk.red('This will overwrite any user changes'));
				log.warn('');

			} else {
				log.warn('');
				log.warn(chalk.bold('Running through setup for a new project.'));
				log.warn(chalk.bold('This can be exited out by pressing [Ctrl+C]'));
				log.warn('');
			}

			log.warn(chalk.bold('Make sure you are running this command in the folder you want all files copied to'));
			log.warn('');

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

			log.info('');
			log.info('Copying over files...');

			fs.copy(appDir, process.cwd(), {
				filter: fileCopyFilter
			}, fileCopyComplete)

		} else {
			log.info('User cancelled - no files copied')
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
			log.debug(chalk.underline('Skipping path - ' + path));
		} else {
			log.debug('Copying path  -', path);
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
		log.debug('');
		log.info('Templating files...');

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
		log.debug('Templating file -', templateFilePath);
	}

	function installNpmPackages() {
		npm.load({ 'save-dev': true }, function (er) {
			if (er) return handlError(er)

			npm.commands.install(_promptAnswers.slateModules, function (err, data) {
				if (err) return console.error(err)

				npm.on("log", function(message) {
					console.log(message);
				})

				finishSetup();
			})
		})
	}

	function finishSetup() {
		log.info('');
		log.info(chalk.green('Setup complete!'));
		log.info('Slate project ' + chalk.yellow(_promptAnswers.projectName) + ' has been installed!');
		log.info('');
		log.info('Final steps:');
		log.info(' · Run ' + chalk.yellow('gulp') + ' for initial setup of styles and scripts.');
		log.info(' · Run ' + chalk.yellow('gulp watch') + ' to setup watching of files');
		log.info('');
	}
}
