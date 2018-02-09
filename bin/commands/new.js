// Enable strict mode for older versions of node
// eslint-disable-next-line strict, lines-around-directive
'use strict';

const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');

const npmInstallPackage = require('npm-install-package');
const emoji = require('node-emoji');

const releaseService = require('../releaseService');
const fileTemplater = require('../fileTemplater');
const promptOptionsService = require('../promptOptions');
const templateDataManager = require('../templateDataManager');
const errorHandler = require('../errorHandler');
const utils = require('../utils');
const Spinner = require('cli-spinner').Spinner;

let log;
let promptAnswers;
let cliOptions;
let isBaseInstall;

let CURRENT_WORKING_DIR;
let TEMPLATE_FILES_PATH;

const newCommandApi = {};

function areInsideProjectDirectory() {
	return path.basename(CURRENT_WORKING_DIR) === promptAnswers.projectName;
}

function setDirectoryPaths() {
	CURRENT_WORKING_DIR = process.cwd();
	TEMPLATE_FILES_PATH = path.join(CURRENT_WORKING_DIR, '_cartridge');
}

function ensureProjectDirectoryExists() {
	return new Promise(resolve => {
		if (areInsideProjectDirectory()) {
			log.debug(
				`Already inside directory: ${chalk.underline(
					CURRENT_WORKING_DIR
				)}, skipping create directory step`
			);

			resolve();
		} else {
			const projectPath = path.resolve(CURRENT_WORKING_DIR, promptAnswers.projectName);

			log.debug(`Making sure the path: ${chalk.underline(projectPath)} exists`);

			fs.ensureDirSync(projectPath);
			process.chdir(projectPath);

			setDirectoryPaths();

			log.debug(
				`Changing working directory to: ${chalk.underline(path.resolve(CURRENT_WORKING_DIR))}`
			);
			log.debug(
				`Changing template files path to: ${chalk.underline(path.resolve(TEMPLATE_FILES_PATH))}`
			);

			resolve();
		}
	});
}

function getCopyExcludeList() {
	// Default exclude folders / files
	const excludeList = ['node_modules'];

	return excludeList;
}

function fileCopyFilter(filePath) {
	let needToCopyFile = true;
	const filesDirsToExclude = getCopyExcludeList();

	for (let i = 0; i < filesDirsToExclude.length; i++) {
		// Check if needToCopyFile is still true and
		// hasn't been flipped during loop
		if (needToCopyFile === true) {
			needToCopyFile = !filePath.includes(filesDirsToExclude[i]);
		}
	}

	if (needToCopyFile === false) {
		log.debug(chalk.underline(`Skipping path - ${filePath}`));
	} else {
		log.debug('Copying path  -', filePath);
	}

	return needToCopyFile;
}

function getTemplateFileList() {
	const fileList = [];

	// Creds file
	fileList.push({
		src: path.join(TEMPLATE_FILES_PATH, 'creds.tpl'),
		dest: path.join(CURRENT_WORKING_DIR, '_config', 'creds.json'),
		deleteSrcFile: true
	});

	// Project package file
	fileList.push({
		src: path.join(TEMPLATE_FILES_PATH, 'package.tpl'),
		dest: path.join(CURRENT_WORKING_DIR, 'package.json'),
		deleteSrcFile: true
	});

	// Project readme
	fileList.push({
		src: path.join(TEMPLATE_FILES_PATH, 'readme.tpl'),
		dest: path.join(CURRENT_WORKING_DIR, 'readme.md')
	});

	// Cartridge config
	fileList.push({
		src: path.join(TEMPLATE_FILES_PATH, 'rc.tpl'),
		dest: path.join(CURRENT_WORKING_DIR, '.cartridgerc')
	});

	return fileList;
}

function singleFileCallback(templateFilePath) {
	log.debug('Templating file -', templateFilePath);
}

function installBaseModules() {
	return new Promise((resolve, reject) => {
		const spinner = new Spinner('%s');
		spinner.setSpinnerString('|/-\\');

		log.info('Installing core modules...');

		if (log.getLevel() <= log.levels.INFO) {
			spinner.start();
		}

		npmInstallPackage([], {}, err => {
			if (err) reject(err);

			if (log.getLevel() <= log.levels.INFO) {
				spinner.stop(true);
			}

			log.info(chalk.bold('...done'));

			resolve();
		});
	});
}

function installExpansionPacks() {
	return new Promise((resolve, reject) => {
		const spinner = new Spinner('%s');
		spinner.setSpinnerString('|/-\\');

		console.log('');
		log.info('Installing expansion packs...');

		if (log.getLevel() <= log.levels.INFO) {
			spinner.start();
		}

		npmInstallPackage(promptAnswers.cartridgeModules, { saveDev: true }, err => {
			if (err) reject(err);

			if (log.getLevel() <= log.levels.INFO) {
				spinner.stop(true);
			}

			log.info(chalk.bold('...done'));
			log.info('');

			resolve();
		});
	});
}

function finishSetup() {
	log.info('');
	log.info(chalk.green('Setup complete!'));
	log.info(
		`Cartridge project ${chalk.yellow(
			promptAnswers.projectName
		)} has been installed in ${chalk.yellow(CURRENT_WORKING_DIR)}`
	);
	log.info('');
	log.info(`${emoji.get('fire')}  Project ready to go - next steps`);
	log.info('');
	log.info(`· Run ${chalk.yellow(`cd ${CURRENT_WORKING_DIR}`)}`);
	log.info(`· Run ${chalk.yellow('gulp build')} for asset generation`);
	log.info(
		`· Run ${chalk.yellow('gulp build --prod')} for production ready / minified asset generation`
	);
	log.info('');
	log.info(`${emoji.get('hammer_and_wrench')}  Extra, optional steps`);
	log.info('');
	log.info(`· Run ${chalk.yellow('gulp watch')} to setup watching of files.`);
	log.info(`· Run ${chalk.yellow('gulp')} to run both asset generation + setup file watchers`);
	log.info(`· Run ${chalk.yellow('gulp --tasks')} to list out all available tasks`);
	log.info('');
}

function postInstallCleanUp() {
	log.debug('');
	log.debug('Running post install cleanup');

	releaseService.deleteReleaseTmpDirectory();

	log.debug(`Deleting templates file directory: ${TEMPLATE_FILES_PATH}`);

	finishSetup();
}

function installNpmPackages(packages) {
	if (promptAnswers.isNodejsSite) {
		packages.push('cartridge-node-server');
	}

	if (packages.length > 0) {
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

function templateCopiedFiles() {
	log.debug('');
	log.info(`${emoji.get('floppy_disk')}  Booting up files...`);

	fileTemplater()
		.run({
			data: templateDataManager.getData(),
			basePath: CURRENT_WORKING_DIR,
			files: getTemplateFileList(),
			onEachFile: singleFileCallback
		})
		.then(() => {
			installNpmPackages(promptAnswers.cartridgeModules);
		});
}

function fileCopyComplete(err) {
	if (err) {
		errorHandler(err);
	}

	templateCopiedFiles();
}

function copyCartridgeSourceFilesToCwd(copyPath) {
	fs.copy(
		copyPath,
		CURRENT_WORKING_DIR,
		{
			filter: fileCopyFilter
		},
		fileCopyComplete
	);
}

function runCartridgeInstallation(answers) {
	promptAnswers = answers;

	templateDataManager.setData(answers);

	if (promptAnswers.userHasConfirmed === true) {
		log.info('');
		log.info(`${emoji.get('joystick')}  Inserting the cartridge...`);

		ensureProjectDirectoryExists()
			.then(() => releaseService.downloadLatestRelease(cliOptions))
			.then(copyCartridgeSourceFilesToCwd)
			.catch(errorHandler);
	} else {
		log.info(`${emoji.get('x')}  User cancelled - cartridge installation aborted!`);
	}
}

function handleBaseInstallPromptData(answers) {
	const augmentedAnswers = answers;
	augmentedAnswers.cartridgeModules = [
		'cartridge-sass',
		'cartridge-javascript',
		'cartridge-copy-assets'
	];

	if (augmentedAnswers.isNodejsSite === false) {
		augmentedAnswers.cartridgeModules.push('cartridge-static-html');
		augmentedAnswers.cartridgeModules.push('cartridge-local-server');
	}

	runCartridgeInstallation(augmentedAnswers);
}

function runBaseInstall() {
	log.warn('');

	log.warn(chalk.bold('This will create a cartridge project that has:'));
	log.info(' · Sass setup');
	log.info(' · JavaScript setup');
	log.info(' · Server setup');
	log.info(' · Copy over static assets fonts etc');
	log.warn('');

	promptOptionsService.getBaseInstallPromptData().then(promptOptions => {
		inquirer.prompt(promptOptions, handleBaseInstallPromptData);
	});
}

function handleNoInternetConnection() {
	log.info('');
	log.info(
		`${emoji.get('rotating_light')}  ${chalk.bold.underline(
			'No internet connection detected'
		)} ${emoji.get('rotating_light')}`
	);
	log.info('');
	log.info('Cartridge requires an internet connection to fully run the installation');
	log.info('Try again when an internet connection is available');
	log.info('');
}

function preSetup() {
	promptOptionsService.setup(cliOptions);

	log.warn('');
	log.warn(chalk.bold('Running through setup for a new project.'));
	log.warn(chalk.bold('This can be exited out by pressing [Ctrl+C]'));
	log.warn('');

	log.warn(
		chalk.bold('Make sure you are running this command in the folder you want all files copied to')
	);
}

function runCompleteInstall() {
	promptOptionsService.getNewCommandPromptOptions().then(promptOptions => {
		console.log('');
		inquirer.prompt(promptOptions, runCartridgeInstallation);
	});
}

function setupOnScreenPrompts() {
	if (isBaseInstall === true) {
		runBaseInstall();
	} else {
		runCompleteInstall();
	}
}

function startInstallation() {
	setDirectoryPaths();
	preSetup();
	setupOnScreenPrompts();
}

newCommandApi.init = (options, baseInstall) => {
	cliOptions = options;
	isBaseInstall = baseInstall;

	log = utils.getLogInstance(cliOptions);

	utils
		.checkIfOnline()
		.then(startInstallation)
		.catch(handleNoInternetConnection);
};

module.exports = newCommandApi;
