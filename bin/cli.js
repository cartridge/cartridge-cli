#!/usr/bin/env node

var program = require('commander');
var inquirer = require('inquirer');
var path = require('path');
var chalk = require('chalk');

var pkg = require(path.resolve(__dirname, '..', 'package.json'));

program.version(pkg.version)

program
    .command('new <name>')
    .description('Create a new project with the provided name')
    .action(function(name) {
        console.log('Creating a new project: %s', chalk.underline(name));

        inquirer.prompt([{
            type: "confirm",
            name: "needTravis",
            message: "Do you need a travis.yml file?",
            default: false 
        }, {
            type: "confirm",
            name: "needAppVeyor",
            message: "Do you need an appveyor.yml file?",
            default: false
        }], function(answers) {
            console.log('hits prompt callback');
            console.log('answers ->', answers);
            console.log('parse answers and copy over files and things');
        })
    });

program.parse(process.argv);