#!/usr/bin/env node
// Enable strict mode for older versions of node
// eslint-disable-next-line strict, lines-around-directive
'use strict';

const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
const program = require('./programBuilder.js');

updateNotifier({ pkg, callback: program }).notify();
