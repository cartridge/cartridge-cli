var exports = module.exports;
var program = require('commander');
var path = require('path');
var libDir = path.resolve(__dirname, '..', 'lib'); 

var newCommand = require('./commands/new')(libDir);
var pkg = require(path.resolve(__dirname, '..', 'package.json'));

module.exports = function() {
    setProgramVersion();
    setNewCommand();
    initProgram();
}

function setNewCommand() {
    program
        .command('new <name>')
        .description('Create a new project with the provided name')
        .action(newCommand.init);
}

function initProgram() {
    program.parse(process.argv);

    if (!process.argv.slice(2).length) {
      program.outputHelp();
    }
}

function setProgramVersion() {
    program.version(pkg.version)
}