#!/usr/bin/env node

var program = require('commander');
var prompt = require('inquirer');
var path = require('path');

var pkg = require(path.resolve(__dirname, '..', 'package.json'));

program.version(pkg.version)

program
    .command('new <name>')
    .description('Create a new project with the provided name')
    .action(function(name) {
        console.log('hits new command');
        console.log('project name is ->', name);
    });

program.parse(process.argv);