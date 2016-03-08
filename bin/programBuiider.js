"use strict";

var program = require('commander');
var path    = require('path');
var os = require('os');
var appDir  = path.resolve(os.tmpDir(), 'cartridge');

var newCommand = require('./commands/new')(appDir);
var pkg        = require(path.resolve(__dirname, '..', 'package.json'));

/**
 * Get the ball-rolling for the whole program
 */
module.exports = function() {
	setProgramBaseSettings();
	setNewCommand();
	initProgram();
}

/**
 * Setup the 'new' command
 */
function setNewCommand() {
	program
		.command('new')
		.description('Create a new project')
		.action(function() {
			newCommand.init(getProgramOptions());
		});
}

/**
 * Initialise program
 */
function initProgram() {
	program.parse(process.argv);

	if (!process.argv.slice(2).length) {
		program.outputHelp();
	}
}

/**
 * Get program option flags
 */
function getProgramOptions() {
	return {
		silent: program.silent,
		verbose: program.verbose
	}
}

/**
 * Set program base settings: version, option flags
 */
function setProgramBaseSettings() {
	program
		.version(pkg.version)
		.option('-s, --silent', 'Surpress all on-screen messages')
		.option('-v, --verbose', 'Show all on-screen messages');
}
