"'use strict";

var titleize = require('titleize');
var chalk = require('chalk');

var utils = require('./utils');
var errorHandler = require('./errorHandler');
var modulePromptsOptions = require('./promptModuleOptions');

var _promptOptions = [];
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

function setPromptOptionsData(moduleList) {
	_promptOptions.push(getProjectTypePromptOptions());
	_promptOptions.push(getProjectNamePromptOptions());
	_promptOptions.push(getProjectAuthorPromptOptions());
	_promptOptions.push(getProjectDescriptionPromptOptions());
	_promptOptions.push(getCartridgeModulesPromptOptions(moduleList));
	_promptOptions.push(getUserConfirmCopyPromptOptions());

	return Promise.resolve(_promptOptions);
}

function getCartridgeModulesPromptOptions(moduleData) {
	return {
		type: 'checkbox',
		name: 'cartridgeModules',
		message: 'What modules would you like included?',
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

function getProjectTypePromptOptions() {
	return {
		type: 'list',
		name: 'projectType',
		message: 'What is the project type?',
		choices: [
			'Dot NET',
			'Static Website'
		]
	}
}

function getProjectNamePromptOptions() {
	return {
		type: 'input',
		name: 'projectName',
		message: 'What is the project name?',
		validate: function(value) { return inputNotEmpty(value, 'Project Name'); },
	}
}

function getProjectAuthorPromptOptions() {
	return {
		type: 'input',
		name: 'projectAuthor',
		message: 'Who is the author of the project?',
		validate: function(value) { return inputNotEmpty(value, 'Author'); },
		filter: function(value) { return titleize(value); }
	}
}

function getProjectDescriptionPromptOptions() {
	return {
		type: 'input',
		name: 'projectDescription',
		message: 'What is the project description?',
		default: function () { return ''; }
	}
}

function getUserConfirmCopyPromptOptions() {
	return {
		type: 'confirm',
		name: 'isOkToCopyFiles',
		message: 'Ready to start setup! Press enter to confirm',
		default: true
	}
}

function inputNotEmpty(value, fieldName) {
	var isValid = (value !== '');

	return (isValid) ? true : fieldName + ' cannot be empty' ;
}

module.exports = promptOptionsApi;