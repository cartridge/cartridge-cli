#!/usr/bin/env node

var program = require('commander');
var inquirer = require('inquirer');
var path = require('path');
var chalk = require('chalk');
var fs = require('fs-extra');

var pkg = require(path.resolve(__dirname, '..', 'package.json'));
var libDir = path.resolve(__dirname, '..', 'lib'); 

program.version(pkg.version)

program
    .command('new <name>')
    .description('Create a new project with the provided name')
    .action(function(name) {
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
    });

program.parse(process.argv);