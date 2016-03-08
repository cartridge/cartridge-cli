'use strict';

var titleize = require('titleize');
var chalk = require('chalk');
var Registry = require('npm-registry');
var npm = new Registry({ retries: 4 });

var NPM_CARTRIDGE_TASK_KEYWORD = 'cartridge-task';
var CARTRIDGE_TASK_MODULES;

var _promptOptions = [];

var promptOptionsApi = {};

promptOptionsApi.getNewCommandPromptOptions = function() {
	return getCartridgeTaskModulesFromNpm()
		.then(setPromptOptionsData);
}

function getCartridgeTaskModulesFromNpm() {

	return new Promise(function(resolve, reject) {

		npm.packages.keyword(NPM_CARTRIDGE_TASK_KEYWORD, function(err, data) {
			if(err) return console.error(err);

			CARTRIDGE_TASK_MODULES = data;

			resolve();
		});

	})

}

function setPromptOptionsData() {
	_promptOptions.push(getProjectTypePromptOptions());
	_promptOptions.push(getProjectNamePromptOptions());
	_promptOptions.push(getProjectAuthorPromptOptions());
	_promptOptions.push(getProjectDescriptionPromptOptions());
	_promptOptions.push(getCartridgeModulesPromptOptions());
	_promptOptions.push(getUserConfirmCopyPromptOptions());

	return Promise.resolve(_promptOptions);
}

function getCartridgeModulesPromptOptions() {
	return {
		type: 'checkbox',
		name: 'cartridgeModules',
		message: 'What modules would you like included?',
		choices: CARTRIDGE_TASK_MODULES
	}
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