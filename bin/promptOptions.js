'use strict';

var titleize = require('titleize');
var chalk = require('chalk');
var Registry = require('npm-registry');
var npm = new Registry({ retries: 4 });

var utils = require('./utils');
var inArray = require('in-array');
var errorHandler = require('./errorHandler');

var NPM_CARTRIDGE_TASK_KEYWORD = 'cartridge-task';
var NPM_CARTRIDGE_DEFAULT_KEYWORD = 'cartridge-module';

var _cartridgeTaskModules;
var _promptOptions = [];
var _log;

var promptOptionsApi = {};

promptOptionsApi.setup = function(options) {
	_log = utils.getLogInstance(options);
}

promptOptionsApi.getNewCommandPromptOptions = function() {
	_log.debug('');
	_log.debug('Getting prompt options data');

	return Promise.all([getCartridgeTaskModulesFromNpm(), getCartridgeDefaultModulesFromNpm()])
		.then(parseDefaultModuleData)
		.then(formatModuleData)
		.then(setPromptOptionsData)
		.catch(function(err) {
			errorHandler(err)
		})
}

function getCartridgeTaskModulesFromNpm() {

	return new Promise(function(resolve, reject) {

		_log.debug('Getting cartridge task modules from npm registry');

		npm.packages.keyword(NPM_CARTRIDGE_TASK_KEYWORD, function(err, data) {
			if(err) errorHandler(err);

			_cartridgeTaskModules = formatModuleData(data);

			resolve(data);
		});

	})
}

function getCartridgeDefaultModulesFromNpm() {

	return new Promise(function(resolve, reject) {

		_log.debug('Getting cartridge task modules from npm registry');

		npm.packages.keyword(NPM_CARTRIDGE_DEFAULT_KEYWORD, function(err, data) {
			if(err) errorHandler(err);

			_cartridgeTaskModules = formatModuleData(data);

			resolve(data);
		});

	})
}

/**
 * Go through all modules and combine the name and description into one key.
 * @param  {Array} moduleData Module data from npm registry
 * @return {Array}            Formatted module data
 */
function formatModuleData(moduleData) {

	var formattedData = moduleData.map(function(module) {
	   var formattedModule = {};

	   formattedModule.name = ' ' + module.name + ((module.description) ? ' - ' + module.description : '') ;
	   formattedModule.checked = module.checked || false;

	   return formattedModule;
	})

	return Promise.resolve(formattedData)
}

function parseDefaultModuleData(data) {
	return new Promise(function(resolve, reject) {

		var moduleList = data[0];
		var defaultModuleList = data[1];
		var moduleAlreadyChecked = [];

		for (var i = 0; i < defaultModuleList.length; i++) {
		    for (var j = 0; j < moduleList.length; j++) {
		    	var defaultModuleName = defaultModuleList[i].name;
		    	var moduleName = moduleList[j].name;
		    	var isDefault = defaultModuleName === moduleName;

		    	if(!inArray(moduleAlreadyChecked, moduleName) && defaultModuleName === moduleName) {
		        	moduleList[j].checked = true;
		        	moduleAlreadyChecked.push(moduleName);
		    	}
		    }
		}

		resolve(moduleList);
	})
}

function setPromptOptionsData(moduleList) {
	_log.debug('Setting prompt options data');

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