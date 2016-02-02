"use strict";

var program = require('commander');
var path = require('path');
var appDir = path.resolve(__dirname, '..', 'app'); 

var newCommand = require('./commands/new')(appDir);
var pkg = require(path.resolve(__dirname, '..', 'package.json'));

module.exports = function() {
    setProgramBaseSettings();
    setNewCommand();
    initProgram();
}

function setNewCommand() {
    program
        .command('new')
        .description('Create a new project')
        .action(function() {
            newCommand.init(getProgramOptions());
        });
}

function initProgram() {
    program.parse(process.argv);

    if (!process.argv.slice(2).length) {
      program.outputHelp();
    }
}

function getProgramOptions() {
    return {
        silent: program.silent,
        verbose: program.verbose
    }
}

function setProgramBaseSettings() {
    program
        .version(pkg.version)
        .option('-s, --silent', 'Surpress all on-screen messages')
        .option('-v, --verbose', 'Show all on-screen messages');
}