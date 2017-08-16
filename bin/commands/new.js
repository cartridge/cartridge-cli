"use strict";

var chalk    = require('chalk');
var inquirer = require('inquirer');
var fs       = require('fs-extra');
var path     = require('path');

var npmInstallPackage = require('npm-install-package')
var emoji = require('node-emoji');

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
var _isBaseInstall;

var CURRENT_WORKING_DIR;
var TEMPLATE_FILES_PATH;

var newCommandApi = {};

newCommandApi.init = function(options, baseInstall) {
	_options = options;
	_isBaseInstall = baseInstall;

	_log = utils.getLogInstance(_options);

	setDirectoryPaths();
	preSetup();
	setupOnScreenPrompts();
}

function setDirectoryPaths() {
	CURRENT_WORKING_DIR = process.cwd();
	TEMPLATE_FILES_PATH = path.join(CURRENT_WORKING_DIR, '_cartridge');
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
	if(_isBaseInstall === true) {
		runBaseInstall();
	} else {
		runCompleteInstall();
	}
}

function runBaseInstall() {
	_log.warn('');

	_log.warn(chalk.bold('This will create a cartridge project that has:'));
	_log.info(' · Sass setup');
	_log.info(' · JavaScript setup');
	_log.info(' · Server setup');
	_log.info(' · Copy over static assets fonts etc');
	_log.warn('');

	promptOptions
		.getBaseInstallPromptData()
		.then(function(promptOptions) {
			inquirer.prompt(promptOptions, handleBaseInstallPromptData);
		})
}

function handleBaseInstallPromptData(answers) {
	answers.cartridgeModules = ['cartridge-sass', 'cartridge-javascript','cartridge-copy-assets'];

	if(answers.isNodejsSite === false) {
		answers.cartridgeModules.push('cartridge-static-html');
		answers.cartridgeModules.push('cartridge-local-server');
	}

	runCartridgeInstallation(answers);
}

function runCompleteInstall() {
	promptOptions
		.getNewCommandPromptOptions()
		.then(function(promptOptions) {
			console.log('');
			inquirer.prompt(promptOptions, runCartridgeInstallation);
		})
}

function areInsideProjectDirectory() {
	return (path.basename(CURRENT_WORKING_DIR) === _promptAnswers.projectName);
}

function ensureProjectDirectoryExists() {
	return new Promise(function(resolve, reject) {
		if (areInsideProjectDirectory()) {
			_log.debug('Already inside directory: ' + chalk.underline(CURRENT_WORKING_DIR) + ', skipping create directory step');
			
			resolve();
		} else {
			var projectPath = path.resolve(CURRENT_WORKING_DIR, _promptAnswers.projectName);

			_log.debug('Making sure the path: ' + chalk.underline(projectPath) + ' exists');

			fs.ensureDirSync(projectPath);
			process.chdir(projectPath);

			setDirectoryPaths();

			_log.debug('Changing working directory to: ' + chalk.underline(path.resolve(CURRENT_WORKING_DIR)));
			_log.debug('Changing template files path to: ' + chalk.underline(path.resolve(TEMPLATE_FILES_PATH)));

			resolve();
		}
	})
}

function runCartridgeInstallation(answers) {
	_promptAnswers = answers;

	templateDataManager.setData(answers);

	if(_promptAnswers.userHasConfirmed === true) {

		_log.info('');
		_log.info(emoji.get('joystick') + '  Inserting the cartridge...');;

		ensureProjectDirectoryExists()
			.then(function() {
				return releaseService.downloadLatestRelease(_options)
			})
			.then(copyCartridgeSourceFilesToCwd)
			.catch(errorHandler);

	} else {
		_log.info(emoji.get('x') + '  User cancelled - cartridge installation aborted!')
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
		if(needToCopyFile === true) {
			needToCopyFile = path.indexOf(filesDirsToExclude[i]) === -1;
		}
	};

	if(needToCopyFile === false) {
		_log.debug(chalk.underline('Skipping path - ' + path));
	} else {
		_log.debug('Copying path  -', path);
	}

	return needToCopyFile;
}

function fileCopyComplete(err) {
	if (err) {
		errorHandler(err);
	}

	templateCopiedFiles();
}

function getCopyExcludeList() {
	//Default exclude folders / files
	var excludeList = [
		'node_modules'
	];

	return excludeList;
}

function templateCopiedFiles() {
	_log.debug('');
	_log.info(emoji.get('floppy_disk') +'  Booting up files...');

	fileTemplater()
		.run({
			data: templateDataManager.getData(),
			basePath: CURRENT_WORKING_DIR,
			files: getTemplateFileList(),
			onEachFile: singleFileCallback
		})
		.then(function() {
			installNpmPackages(_promptAnswers.cartridgeModules)
		})
}

function getTemplateFileList() {
	var fileList = [];

	// Creds file
	fileList.push({
		src:  path.join(TEMPLATE_FILES_PATH, 'creds.tpl'),
		dest: path.join(CURRENT_WORKING_DIR, '_config', 'creds.json'),
		deleteSrcFile: true
	});

	// Project package file
	fileList.push({
		src:  path.join(TEMPLATE_FILES_PATH, 'package.tpl'),
		dest: path.join(CURRENT_WORKING_DIR, 'package.json'),
		deleteSrcFile: true
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

function installNpmPackages(packages) {
	if(_promptAnswers.isNodejsSite) {
		packages.push('cartridge-node-server');
	}

	if(packages.length > 0) {
		installExpansionPacks(packages)
			.then(installBaseModules)
			.then(postInstallCleanUp)
			.catch(errorHandler);
	} else {
		installBaseModules()
			.then(postInstallCleanUp)
			.catch(errorHandler);
	}
}

function installBaseModules() {
	return new Promise(function(resolve, reject) {
		var spinner = new Spinner('%s');
		spinner.setSpinnerString('|/-\\');

		_log.info('Installing core modules...');

		if(_log.getLevel() <= _log.levels.INFO) {
			spinner.start();
		}

		npmInstallPackage([], {}, function(err) {
			if (err) reject(err);

			if(_log.getLevel() <= _log.levels.INFO) {
				spinner.stop(true);
			}

			_log.info(chalk.bold('...done'));

			resolve();
		})
	})
}

function installExpansionPacks(packages, callback) {
	return new Promise(function(resolve, reject) {
		var spinner = new Spinner('%s');
		spinner.setSpinnerString('|/-\\');

		console.log('');
		_log.info('Installing expansion packs...');

		if(_log.getLevel() <= _log.levels.INFO) {
			spinner.start();
		}

		npmInstallPackage(_promptAnswers.cartridgeModules, { saveDev: true }, function(err) {
			if (err) reject(err);

			if(_log.getLevel() <= _log.levels.INFO) {
				spinner.stop(true);
			}

			_log.info(chalk.bold('...done'));
			_log.info('');

			resolve();
		})
	})
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
	_log.info('Cartridge project ' + chalk.yellow(_promptAnswers.projectName) + ' has been installed in ' + chalk.yellow(CURRENT_WORKING_DIR));
	_log.info('');
	_log.info(emoji.get('fire') + '  Project ready to go - next steps');
	_log.info('');
	_log.info('· Run ' + chalk.yellow('cd ' + CURRENT_WORKING_DIR));
	_log.info('· Run ' + chalk.yellow('gulp build') + ' for asset generation');
	_log.info('· Run ' + chalk.yellow('gulp build --prod') + ' for production ready / minified asset generation');
	_log.info('');
	_log.info(emoji.get('hammer_and_wrench') + '  Extra, optional steps');
	_log.info('');
	_log.info('· Run ' + chalk.yellow('gulp watch') + ' to setup watching of files.');
	_log.info('· Run ' + chalk.yellow('gulp') + ' to run both asset generation + setup file watchers');
	_log.info('· Run ' + chalk.yellow('gulp --tasks') + ' to list out all available tasks');
	_log.info('');
}

module.exports = newCommandApi;
