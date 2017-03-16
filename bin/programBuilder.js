"use strict";

var program = require('commander');
var path    = require('path');
var os = require('os');

var newCommand = require('./commands/new');
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
		.command('new [baseInstall]')
		.description('Create a new project (on-screen wizard)')
		.option("-B, --base", "Use the base install pre-set")
		.action(function(env, options) {
			newCommand.init(getProgramOptions(), options.base);
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
