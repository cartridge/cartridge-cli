"use strict";

var chalk    = require('chalk');
var inquirer = require('inquirer');
var fs       = require('fs-extra');
var path     = require('path');

var npmInstallPackage = require('npm-install-package')

var releaseService = require('../releaseService');
var fileTemplater = require('../fileTemplater');
var promptOptions = require('../promptOptions');
var templateDataManager = require('../templateDataManager');
var errorHandler = require('../errorHandler');
var utils = require('../utils');
var Spinner = require('cli-spinner').Spinner;

var _log;
var _promptAnswers;
var _options;

var CURRENT_WORKING_DIR = process.cwd();
var TEMPLATE_FILES_PATH = path.join(CURRENT_WORKING_DIR, '_cartridge');

var newCommandApi = {};

newCommandApi.init = function(options) {
	_options = options;
	_log = utils.getLogInstance(_options);

	preSetup();
	setupOnScreenPrompts();
}

function preSetup() {
	promptOptions.setup(_options);

	_log.warn('');
	_log.warn(chalk.bold('Running through setup for a new project.'));
	_log.warn(chalk.bold('This can be exited out by pressing [Ctrl+C]'));
	_log.warn('');

	_log.warn(chalk.bold('Make sure you are running this command in the folder you want all files copied to'));
}

function setupOnScreenPrompts() {
	promptOptions
		.getNewCommandPromptOptions()
	 	.then(function(promptOptions) {
	 		console.log('');
	 		inquirer.prompt(promptOptions, promptCallback);
 		})
}

function promptCallback(answers) {
	_promptAnswers = answers;
	templateDataManager.setData(answers);

	if(_promptAnswers.isOkToCopyFiles) {

		_log.info('');
		_log.info('Inserting the cartridge...');

		releaseService
			.downloadLatestRelease(_options)
			.then(copyCartridgeSourceFilesToCwd)

	} else {
		_log.info('User cancelled - no files copied')
	}
}

function copyCartridgeSourceFilesToCwd(copyPath) {
	fs.copy(copyPath, CURRENT_WORKING_DIR, {
		filter: fileCopyFilter
	}, fileCopyComplete)
}

function fileCopyFilter(path) {
	var needToCopyFile = true;
	var filesDirsToExclude = getCopyExcludeList();

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
	if (err) errorHandler(err);

	templateCopiedFiles();
}

function getCopyExcludeList() {
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
	_log.info('Booting up files...');

	fileTemplater.setConfig({
		data: templateDataManager.getData(),
		basePath: CURRENT_WORKING_DIR,
		files: getTemplateFileList(),
		onEachFile: singleFileCallback,
		onCompleted: installNpmPackages
	})

	fileTemplater.run();
}

function getTemplateFileList() {
	var fileList      = [];

	// Creds file
	fileList.push({
		src:  path.join(TEMPLATE_FILES_PATH, 'creds.tpl'),
		dest: path.join(CURRENT_WORKING_DIR, '_config', 'creds.json')
	});

	// Project package file
	fileList.push({
		src:  path.join(TEMPLATE_FILES_PATH, 'package.tpl'),
		dest: path.join(CURRENT_WORKING_DIR, 'package.json')
	});

	// Project readme
	fileList.push({
		src:  path.join(TEMPLATE_FILES_PATH, 'readme.tpl'),
		dest: path.join(CURRENT_WORKING_DIR, 'readme.md')
	});

	// Cartridge config
	fileList.push({
		src:  path.join(TEMPLATE_FILES_PATH, 'rc.tpl'),
		dest: path.join(CURRENT_WORKING_DIR, '.cartridgerc')
	});

	return fileList;
}

function singleFileCallback(templateFilePath) {
	_log.debug('Templating file -', templateFilePath);
}

function installNpmPackages() {
	var spinner = new Spinner('%s');
	spinner.setSpinnerString('|/-\\');

	if(_promptAnswers.cartridgeModules.length > 0) {
		console.log('');
		_log.info('Installing expansion packs...');

		if(_log.getLevel() <= 2) {
			spinner.start();
		}

		npmInstallPackage(_promptAnswers.cartridgeModules, { saveDev: true}, function(err) {
			if (err) errorHandler(err);

			if(_log.getLevel() <= 2) {
				spinner.stop(true);
			}

			postInstallCleanUp();
		})
	} else {
		postInstallCleanUp();
	}
}

function postInstallCleanUp() {
	_log.debug('');
	_log.debug('Running post install cleanup');

	releaseService.deleteReleaseTmpDirectory();

	_log.debug('Deleting templates file directory: ' + TEMPLATE_FILES_PATH);

	finishSetup();
}

function finishSetup() {
	_log.info('');
	_log.info(chalk.green('Setup complete!'));
	_log.info('Cartridge project ' + chalk.yellow(_promptAnswers.projectName) + ' has been installed!');
	_log.info('');
	_log.info('Final steps:');
	_log.info(' · Run ' + chalk.yellow('npm install') + ' to download all project dependencies. (If this fails you may need to run ' + chalk.yellow('sudo npm install') + ')');
	_log.info(' · Run ' + chalk.yellow('gulp') + ' for initial setup of styles and scripts.');
	_log.info(' · Run ' + chalk.yellow('gulp watch') + ' to setup watching of files.');
	_log.info('');
}

module.exports = newCommandApi;