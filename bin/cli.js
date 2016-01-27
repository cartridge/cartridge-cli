#!/usr/bin/env node

var program = require('commander');
var prompt = require('inquirer');
var path = require('path');
var chalk = require('chalk');

var pkg = require(path.resolve(__dirname, '..', 'package.json'));

program.version(pkg.version)

program
    .command('new <name>')
    .description('Create a new project with the provided name')
    .action(function(name) {
        console.log('Creating a new project: %s', chalk.underline(name));
        console.log('@TODO add this in!');
    });

program.parse(process.argv);