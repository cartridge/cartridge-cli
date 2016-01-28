var chalk = require('chalk');
var inquirer = require('inquirer');
var fs = require('fs-extra');
var path = require('path');
var template = require('lodash/template');

var _projectName;

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
        _projectName = name;
        console.log('Creating a new project: %s', chalk.underline(_projectName));
        inquirer.prompt(PROMPT_OPTIONS, inquirerCallback);
    }

    function inquirerCallback(answers) {

        /**
         * THIS IS HORRIBLE
         * REFACTOR!!!111
         */

        if(answers.isOkToCopyFiles) {
            console.log('copying over files...');

            fs.copy(libDir, process.cwd(), function (err) {
                if (err) return console.error(err)

                fs.readFile(path.join(process.cwd(), '_config', 'creds.json'), 'utf8', function(err, data) {
                    if (err) return console.error(err)

                    var compiled = template(data);
                    var output = compiled({
                        projectName: _projectName
                    });

                    fs.writeFile(path.join(process.cwd(), '_config', 'creds.json'), output, 'utf8', function(err) {
                        if (err) return console.error(err)

                        console.log("success! - files copied");
                    });

                });
            })

        } else {
            console.log('User cancelled - no files copied')
        }
    }
}