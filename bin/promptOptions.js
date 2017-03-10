"'use strict";

var titleize = require('titleize');
var chalk = require('chalk');

var utils = require('./utils');
var errorHandler = require('./errorHandler');
var modulePromptsOptions = require('./promptModuleOptions');
var emoji = require('node-emoji')

var _log;

var promptOptionsApi = {};

promptOptionsApi.setup = function(options) {
	_log = utils.getLogInstance(options);

	modulePromptsOptions.setup(options);
}

promptOptionsApi.getNewCommandPromptOptions = function() {
	_log.debug('');
	_log.debug('Getting prompt options data');

	return modulePromptsOptions
		.getOptions()
		.then(setPromptOptionsData)
		.catch(function(err) {
			errorHandler(err)
		})
}

promptOptionsApi.getBaseInstallPromptData = function() {
	_log.debug('');
	_log.debug('Getting base install prompt options data');

	return Promise.resolve([
		getProjectNamePromptOptions(),
		getProjectAuthorPromptOptions(),
		getProjectDescriptionPromptOptions(),
		getIfProjectIsNodejsSite(),
		getUserConfirmCopyPromptOptions()
	]);
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

function getCartridgeModulesPromptOptions(moduleData) {
	return {
		type: 'checkbox',
		name: 'cartridgeModules',
		message: emoji.get('star') + '  What modules would you like included?',
		choices: moduleData,
		filter: extractModuleNames
	}
}

function extractModuleNames(values) {
	var moduleNames = [];

	values.forEach(function (value) {
		var regex = /\s([^\s]+)\s.*/g;
		var matches = regex.exec(value);
		moduleNames.push(matches[1]);
	});

	return moduleNames;
}

function getIfProjectIsNodejsSite() {
	return {
		type: 'confirm',
		name: 'isNodejsSite',
		message: emoji.get('sparkles') + '  Is the project using Node.js server-side? (This will install a blank Node.js server setup)',
		default: false
	}
}

function getProjectNamePromptOptions() {
	return {
		type: 'input',
		name: 'projectName',
		message: emoji.get('blue_book')  + '  What is the project name?',
		validate: function(value) { return inputNotEmpty(value, 'Project Name'); },
	}
}

function getProjectAuthorPromptOptions() {
	return {
		type: 'input',
		name: 'projectAuthor',
		message: emoji.get('sleuth_or_spy') + '  Who is the author of the project?',
		validate: function(value) { return inputNotEmpty(value, 'Author'); },
		filter: function(value) { return titleize(value); }
	}
}

function getProjectDescriptionPromptOptions() {
	return {
		type: 'input',
		name: 'projectDescription',
		message: emoji.get('pencil2') + '  What is the project description?',
		default: function () { return ''; }
	}
}

function getUserConfirmCopyPromptOptions() {
	return {
		type: 'confirm',
		name: 'userHasConfirmed',
		message: emoji.get('warning') + '  Ready to start setup! Press enter to confirm',
		default: true
	}
}

function inputNotEmpty(value, fieldName) {
	var isValid = (value !== '');

	return (isValid) ? true : fieldName + ' cannot be empty' ;
}

module.exports = promptOptionsApi;
