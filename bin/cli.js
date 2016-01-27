#!/usr/bin/env node

var program = require('commander');
var prompt = require('inquirer');
var path = require('path');

var pkg = require(path.resolve(__dirname, '..', 'package.json'));

program.version(pkg.version)

program
    .command('new')
    .action(function() {
        console.log('hits new command');
    });

program.parse(process.argv);