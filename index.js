'use strict';

var fs    = require('fs-extra');
var del   = require('del');
var path  = require('path');
var ncp   = require('ncp').ncp;
var chalk = require('chalk');

var CONFIG_FILE = '/.cartridgecli';

var paths = {
	project: path.resolve('../../'),
	config: path.resolve('../../_config')
};

var slateCliApi = {};

// Checks if the project has been set up with slate
function hasSlate() {
	try {
		fs.accessSync(paths.project + CONFIG_FILE, fs.R_OK | fs.W_OK);
	} catch(err) {
		return false;
	}

	return true;
}

function modifyJsonFile(path, transform, callback) {
	fs.readJson(path, function (err, fileContents) {
		if(!err) {
			fileContents = transform(fileContents);
			fs.writeJson(path, fileContents, callback);
		} else {
			callback(err);
		}
	});
}

var modulePrototype = {};

// Adds the specified module to the .slaterc file
slateCliApi.addToSlaterc = function addToSlaterc(module, callback) {
	modifyJsonFile(paths.project + CONFIG_FILE, function addModule(data) {
		if(!data.hasOwnProperty('modules')) {
			data.modules = [];
		}

		data.modules.push(module);

		return data;
	}, callback);
};

// Removes the specified module from the .slaterc file
slateCliApi.removeFromSlaterc = function removeFromSlaterc(module, callback) {
	// TODO: implement
};

slateCliApi.ensureSlateExists = function ensureSlateExists() {
	if(!hasSlate()) {
		console.error(chalk.red('Slate is not set up in this directory. Please set it up first before installing this module'));
		process.exit(1);
	}
};

// Modify the project configuration (project.json) with a transform function
slateCliApi.modifyProjectConfig = function modifyProjectConfig(transform, callback) {
	modifyJsonFile(paths.config + '/project.json', transform, callback);
};

// Add configuration files to the project _config directory for this module
slateCliApi.addModuleConfig = function addModuleConfig(configPath, callback) {
	ncp(configPath, paths.config, callback);
};

// Remove configuration files from the project _config directory for this module
slateCliApi.removeModuleConfig = function removeModuleConfig() {
	// TODO: implement
};

module.exports = slateCliApi;
