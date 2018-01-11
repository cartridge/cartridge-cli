// Enable strict mode for older versions of node
// eslint-disable-next-line strict, lines-around-directive
'use strict';

const titleize = require('titleize');

const utils = require('./utils');
const errorHandler = require('./errorHandler');
const modulePromptsOptions = require('./promptModuleOptions');
const emoji = require('node-emoji');

let log;

const promptOptionsApi = {};

function extractModuleNames(values) {
	const moduleNames = [];

	values.forEach(value => {
		const regex = /\s([^\s]+)\s.*/g;
		const matches = regex.exec(value);
		moduleNames.push(matches[1]);
	});

	return moduleNames;
}

function inputNotEmpty(value, fieldName) {
	const isValid = value !== '';

	return isValid ? true : `${fieldName} cannot be empty`;
}

function getCartridgeModulesPromptOptions(moduleData) {
	return {
		type: 'checkbox',
		name: 'cartridgeModules',
		message: `${emoji.get('star')}  What modules would you like included?`,
		choices: moduleData,
		filter: extractModuleNames
	};
}

function getIfProjectIsNodejsSite() {
	return {
		type: 'confirm',
		name: 'isNodejsSite',
		message: `${emoji.get(
			'sparkles'
		)}  Is the project using Node.js server-side? (This will install a blank Node.js server setup)`,
		default: false
	};
}

function getProjectNamePromptOptions() {
	return {
		type: 'input',
		name: 'projectName',
		message: `${emoji.get('blue_book')}  What is the project name?`,
		validate(value) {
			return inputNotEmpty(value, 'Project Name');
		}
	};
}

function getProjectAuthorPromptOptions() {
	return {
		type: 'input',
		name: 'projectAuthor',
		message: `${emoji.get('sleuth_or_spy')}  Who is the author of the project?`,
		validate(value) {
			return inputNotEmpty(value, 'Author');
		},
		filter(value) {
			return titleize(value);
		}
	};
}

function getProjectDescriptionPromptOptions() {
	return {
		type: 'input',
		name: 'projectDescription',
		message: `${emoji.get('pencil2')}  What is the project description?`,
		default() {
			return '';
		}
	};
}

function getUserConfirmCopyPromptOptions() {
	return {
		type: 'confirm',
		name: 'userHasConfirmed',
		message: `${emoji.get('warning')}  Ready to start setup! Press enter to confirm`,
		default: true
	};
}

function setPromptOptionsData(moduleList) {
	return Promise.resolve([
		getProjectNamePromptOptions(),
		getProjectAuthorPromptOptions(),
		getProjectDescriptionPromptOptions(),
		getIfProjectIsNodejsSite(),
		getCartridgeModulesPromptOptions(moduleList),
		getUserConfirmCopyPromptOptions()
	]);
}

promptOptionsApi.setup = options => {
	log = utils.getLogInstance(options);

	modulePromptsOptions.setup(options);
};

promptOptionsApi.getNewCommandPromptOptions = () => {
	log.debug('');
	log.debug('Getting prompt options data');

	return modulePromptsOptions
		.getOptions()
		.then(setPromptOptionsData)
		.catch(err => {
			errorHandler(err);
		});
};

promptOptionsApi.getBaseInstallPromptData = () => {
	log.debug('');
	log.debug('Getting base install prompt options data');

	return Promise.resolve([
		getProjectNamePromptOptions(),
		getProjectAuthorPromptOptions(),
		getProjectDescriptionPromptOptions(),
		getIfProjectIsNodejsSite(),
		getUserConfirmCopyPromptOptions()
	]);
};

module.exports = promptOptionsApi;
