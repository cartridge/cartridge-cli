'use strict';

var fs    = require('fs-extra');
var del   = require('del');
var path  = require('path');
var chalk = require('chalk');

var paths = {
	project: path.resolve('../../'),
	config: path.resolve('../../_config')
};

var Quarry = {};

// Checks if the project has been set up with slate
function hasSlate() {
	try {
		fs.accessSync(paths.project + '/.slaterc', fs.R_OK | fs.W_OK);
	} catch(err) {
		return false;
	}

	return true;
}

var modulePrototype = {};

// Adds the specified module to the .slaterc file
Quarry.addToSlaterc = function addModule(module) {
	// TODO: implement
};

// Removes the specified module from the .slaterc file
Quarry.removeFromSlaterc = function removeModule(module) {
	// TODO: implement
};

Quarry.ensureSlateExists() {
	if(!hasSlate()) {
		console.error(chalk.red('Slate is not set up in this directory. Please set it up first before installing this module'));
		process.exit(1);
	}
};

// Modify the project configuration (project.json) with a transform function
Quarry.modifyProjectConfig = function modifyProjectConfig(transform) {
	var config = require(CONFIG_PATH + 'project.json');
	config = transform(config);

	fs.writeFile(CONFIG_PATH + 'project.json', JSON.encode(config));
};

// Add configuration files to the project _config directory for this module
Quarry.addModuleConfig = function addConfig(files, callback) {
	var i;
	var configCount = files.length;
	var copyCount   = 0;

	var copyComplete = function copyComplete(err) {
		if (err) return console.error(err);

		copyCount++;
		if(copyCount >=configCount) {
			callback();
		}
	};

	for(i = 0; i < configCount; i++) {
		fs.copy(files[i], CONFIG_PATH + path.basename(files[i]), copyComplete);
	}
};

// Remove configuration files from the project _config directory for this module
Quarry.removeConfig = function removeConfig() {
	// TODO: implement
};

module.exports = Quarry;
