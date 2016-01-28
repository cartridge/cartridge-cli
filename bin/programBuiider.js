var program = require('commander');
var path = require('path');
var appDir = path.resolve(__dirname, '..', 'app'); 

var newCommand = require('./commands/new')(appDir);
var pkg = require(path.resolve(__dirname, '..', 'package.json'));

module.exports = function() {
    setProgramVersion();
    setNewCommand();
    initProgram();
}

function setNewCommand() {
    program
        .command('new')
        .description('Create a new project')
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