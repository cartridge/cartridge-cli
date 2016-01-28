var chalk = require('chalk');
var inquirer = require('inquirer');
var fs = require('fs-extra');
var path = require('path');

var PROMPT_OPTIONS = [{
    type: "confirm",
    name: "isOkToCopyFiles",
    message: "Copying over files to current directory. Press enter to confirm",
    default: true 
}]

module.exports = function(libDir) {

    return {
        init: init
    };

    function init(name) {
        console.log('Creating a new project: %s', chalk.underline(name));
        inquirer.prompt(PROMPT_OPTIONS, inquirerCallback)
    }

    function inquirerCallback(answers) {

        if(answers.isOkToCopyFiles) {
            console.log('copying over files...');

            fs.copy(libDir, process.cwd(), function (err) {
              if (err) return console.error(err)
              console.log("success! - files copied");
            })
        } else {
            console.log('User cancelled - no files copied')
        }
    }
}