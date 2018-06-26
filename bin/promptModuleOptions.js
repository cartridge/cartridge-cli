// Enable strict mode for older versions of node
// eslint-disable-next-line strict, lines-around-directive
'use strict';

const Registry = require('npm-registry');
const inArray = require('in-array');

const utils = require('./utils');
const errorHandler = require('./errorHandler');
const npmKeyword = require('npm-keyword');

const npm = new Registry({
	registry: 'http://registry.npmjs.org',
	retries: 4
});

const NPM_CARTRIDGE_TASK_KEYWORD = 'cartridge-task';
const NPM_CARTRIDGE_DEFAULT_KEYWORD = 'cartridge-module-default';

let log;

const promptModuleOptionsApi = {};

/**
 * Get name, description of all cartridge modules with the task keyword
 */
function getCartridgeTaskModulesFromNpm() {
	return npmKeyword(NPM_CARTRIDGE_TASK_KEYWORD);
}

/**
 * Get name, description of all cartridge modules using the default keyword
 */
function getCartridgeDefaultModulesFromNpm() {
	return npmKeyword(NPM_CARTRIDGE_DEFAULT_KEYWORD);
}

/**
 * Compare task and default modules
 * Set `checked` as true if a module is in both sets of data
 * @param  {Array} data Data for both module keyword sets
 */
function parseDefaultModuleData(data) {
	return new Promise(resolve => {
		const moduleList = data[0];
		const defaultModuleList = data[1];
		const moduleAlreadyChecked = [];

		for (let i = 0; i < defaultModuleList.length; i++) {
			for (let j = 0; j < moduleList.length; j++) {
				const defaultModuleName = defaultModuleList[i].name;
				const moduleName = moduleList[j].name;

				if (!inArray(moduleAlreadyChecked, moduleName) && defaultModuleName === moduleName) {
					moduleList[j].checked = true;
					moduleAlreadyChecked.push(moduleName);
				}
			}
		}

		resolve(moduleList);
	});
}

/**
 * Go through all modules and combine the name and description into one key.
 * Map `checked` value
 * @param  {Array} moduleData Module data from npm registry
 * @return {Array}            Formatted module data
 */
function formatModuleData(moduleData) {
	const formattedData = moduleData.map(module => {
		const formattedModule = {};
		const description = module.description ? ` -  ${module.description}` : '';

		formattedModule.name = ` ${module.name}${description}`;
		formattedModule.checked = module.checked || false;

		return formattedModule;
	});

	return Promise.resolve(formattedData);
}

/**
 * Setup function. Assigns internal log instance
 * @param  {Object} options Command line options (silent, verbose)
 */
promptModuleOptionsApi.setup = options => {
	log = utils.getLogInstance(options);
};

/**
 * Get cartridge module data, formatted for inquirer
 * @return {Promise}
 */
promptModuleOptionsApi.getOptions = () => {
	log.debug('Getting prompt module data');

	return Promise.all([getCartridgeTaskModulesFromNpm(), getCartridgeDefaultModulesFromNpm()])
		.then(parseDefaultModuleData)
		.then(formatModuleData)
		.catch(err => {
			errorHandler(err);
		});
};

module.exports = promptModuleOptionsApi;
