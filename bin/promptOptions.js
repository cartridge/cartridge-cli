'use strict';

var titleize = require('titleize');
var chalk = require('chalk');
var npm = require('npm');

var _promptOptions = [];

var NPM_SEARCH_KEYWORD = "karma-launcher";

module.exports = function() {

	return {
		getNewCommandPromptOptions: getNewCommandPromptOptions
	}

}

function getNewCommandPromptOptions() {
	 return getNpmRepositoryData()
	 	.then(formatNpmData)
	 	.then(setPromptOptionsData);
}

function getNpmRepositoryData() {
	return new Promise(function(resolve, reject) {
		console.log(chalk.bold('...Running pre-setup...'));

		npm.load({}, function(err) {
	  		if (err) reject(err)

	  		//true to surpress stdout
			npm.commands.search([NPM_SEARCH_KEYWORD], true, function (er, data) {
				if (er) reject(err)

				resolve(data);
			})
		})
	})
}

function formatNpmData(npmData) {
	var choices = [];

	for (var npmPackageName in npmData) {
		choices.push({
			name: npmPackageName
		})
	}

	return Promise.resolve(choices);
}

function setPromptOptionsData(npmModuleChoices) {
	_promptOptions.push(getProjectTypePromptOptions());
	_promptOptions.push(getProjectNamePromptOptions());
	_promptOptions.push(getProjectAuthorPromptOptions())
	_promptOptions.push(getProjectDescriptionPromptOptions());
	_promptOptions.push(getSlateModulesPromptOptions(npmModuleChoices))
	_promptOptions.push(getUserConfirmCopyPromptOptions())

	console.log(chalk.bold('...Pre-setup complete, get ready fighters...'));

	return Promise.resolve(_promptOptions);
}

function getSlateModulesPromptOptions(npmModuleChoices) {
	return {
		type: 'checkbox',
		name: 'slateModules',
		message: 'What modules would you like included?',
		choices: npmModuleChoices
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
		message: 'Read to start setup! Press enter to confirm',
		default: true
	}
}

function inputNotEmpty(value, fieldName) {
	var isValid = (value !== '');

	return (isValid) ? true : fieldName + ' cannot be empty' ;
}
