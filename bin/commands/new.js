var exports = module.exports;
var chalk = require('chalk');
var inquirer = require('inquirer');
var fs = require('fs-extra');
var path = require('path');

var libDir = path.resolve(__dirname, '..', '..' ,'lib'); 

exports.init = function(name) {
    console.log('Creating a new project: %s', chalk.underline(name));

    inquirer.prompt([{
        type: "confirm",
        name: "needTravis",
        message: "Copying over files to current directory. Press enter to confirm",
        default: true 
    }], function(answers) {
        console.log('copying over files...');

        fs.copy(libDir, process.cwd(), function (err) {
          if (err) return console.error(err)
          console.log("success! - files copied");
        })
    })
}