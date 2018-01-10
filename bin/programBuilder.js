// Enable strict mode for older versions of node
// eslint-disable-next-line strict, lines-around-directive
'use strict';

const path = require('path');

const program = require('commander');

const newCommand = require('./commands/new');

/* eslint import/no-dynamic-require:0  */
const pkg = require(path.resolve(__dirname, '..', 'package.json'));

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
 * Setup the 'new' command
 */
function setNewCommand() {
	program
		.command('new [baseInstall]')
		.description('Create a new project (on-screen wizard)')
		.option("-B, --base", "Use the base install pre-set")
		.action((env, options) => {
			newCommand.init(getProgramOptions(), options.base);
		});
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

/**
 * Get the ball-rolling for the whole program
 */
module.exports = () => {
	setProgramBaseSettings();
	setNewCommand();
	initProgram();
};
