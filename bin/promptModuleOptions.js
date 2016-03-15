'use strict';

var Registry = require('npm-registry');
var npm = new Registry({ retries: 4 });
var inArray = require('in-array');

var utils = require('./utils');
var errorHandler = require('./errorHandler');

var NPM_CARTRIDGE_TASK_KEYWORD = 'cartridge-task';
var NPM_CARTRIDGE_DEFAULT_KEYWORD = 'cartridge-module-default';

var _log;

var promptModuleOptionsApi = {};

/**
 * Setup function. Assigns internal log instance
 * @param  {Object} options Command line options (silent, verbose)
 */
promptModuleOptionsApi.setup = function(options) {
	_log = utils.getLogInstance(options);
}

/**
 * Get cartridge module data, formatted for inquirer
 * @return {Promise}
 */
promptModuleOptionsApi.getOptions = function() {

	_log.debug('Getting prompt module data');

	return Promise.all([getCartridgeTaskModulesFromNpm(), getCartridgeDefaultModulesFromNpm()])
		.then(parseDefaultModuleData)
		.then(formatModuleData)
		.catch(function(err) {
			errorHandler(err);
		})
}

/**
 * Get name, description of all cartridge modules with the task keyword
 */
function getCartridgeTaskModulesFromNpm() {

	return new Promise(function(resolve, reject) {

		npm.packages.keyword(NPM_CARTRIDGE_TASK_KEYWORD, function(err, data) {
			if(err) errorHandler(err);

			resolve(data);
		});

	})
}

/**
 * Get name, description of all cartridge modules using the default keyword
 */
function getCartridgeDefaultModulesFromNpm() {

	return new Promise(function(resolve, reject) {

		npm.packages.keyword(NPM_CARTRIDGE_DEFAULT_KEYWORD, function(err, data) {
			if(err) errorHandler(err);

			resolve(data);
		});

	})
}

/**
 * Compare task and default modules
 * Set `checked` as true if a module is in both sets of data
 * @param  {Array} data Data for both module keyword sets
 */
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

/**
 * Go through all modules and combine the name and description into one key.
 * Map `checked` value
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

module.exports = promptModuleOptionsApi;