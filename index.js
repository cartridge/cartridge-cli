'use strict';

var CONFIG_FILE = '/.cartridgerc';
var MATCH_REGEX = /(\[\/\/\]: <> \(Modules start\)\s)([^[]*)(\[\/\/\]: <> \(Modules end\)\s)/g;

var fs        = require('fs-extra');
var del       = require('del');
var path      = require('path');
var ncp       = require('ncp').ncp;
var chalk     = require('chalk');
var template = require('lodash/template');

var paths = {
	project:   path.resolve('../../'),
	config:    path.resolve('../../', '_config'),
	readme:    path.resolve('../../', 'readme.md'),
	cartridge: path.resolve('../../_cartridge')
};


var cartridgeApi = {};

// Checks if the project has been set up with slate
function hasSlate() {
	try {
		fs.accessSync(paths.project + CONFIG_FILE, fs.R_OK | fs.W_OK);
	} catch(err) {
		return false;
	}

	return true;
}

function insertModulesInToReadme(readmeContents, moduleContent) {
	return readmeContents.replace(MATCH_REGEX, moduleContent);
}

function updateReadme(moduleContent) {
	fs.readFile(paths.readme, 'utf8', function(err, readmeContents) {
		if (err) return console.error(err);

		fs.writeFile(paths.readme, insertModulesInToReadme(readmeContents, moduleContent), 'utf8', function(err) {
			if (err) return console.error(err);
			console.log('Readme updated');
		});
	});
}

function updateReadmeModules(data) {
	var compiledTemplate;

	fs.readFile(path.join(paths.cartridge, 'modules.tpl'), 'utf8', function(err, moduleTemplate) {
		if (err) return console.error(err);

		compiledTemplate = template(moduleTemplate);
		updateReadme(compiledTemplate(data));
	});
}

function modifyJsonFile(path, transform, callback) {
	fs.readJson(path, function (err, fileContents) {
		if(!err) {
			fileContents = transform(fileContents);
			fs.writeJson(path, fileContents, function(err) {
				callback(err, fileContents);
			});
		} else {
			callback(err);
		}
	});
}

cartridgeApi.ensureCartridgeExists = function ensureCartridgeExists() {
	if(!hasSlate()) {
		console.error(chalk.red('Slate is not set up in this directory. Please set it up first before installing this module'));
		process.exit(1);
	}
};

// Adds the specified module to the .slaterc file
cartridgeApi.addToRc = function addToRc(module, callback) {
	modifyJsonFile(paths.project + CONFIG_FILE, function addModule(data) {
		if(!data.hasOwnProperty('modules')) {
			data.modules = [];
		}

		data.modules.push(module);

		return data;
	}, function(err, jsonContent) {
		updateReadmeModules(jsonContent);
		callback(err);
	});
};

// Removes the specified module from the .slaterc file
cartridgeApi.removeFromRc = function removeFromRc(module, callback) {
	// TODO: implement
};

// Modify the project configuration (project.json) with a transform function
cartridgeApi.modifyProjectConfig = function modifyProjectConfig(transform, callback) {
	modifyJsonFile(paths.config + '/project.json', transform, callback);
};

// Add configuration files to the project _config directory for this module
cartridgeApi.addModuleConfig = function addModuleConfig(configPath, callback) {
	ncp(configPath, paths.config, callback);
};

// Remove configuration files from the project _config directory for this module
cartridgeApi.removeModuleConfig = function removeModuleConfig() {
	// TODO: implement
};

module.exports = cartridgeApi;
