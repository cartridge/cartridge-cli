#!/usr/bin/env node
"use strict";

var updateNotifier = require('update-notifier');
var pkg = require('../package.json');
var program = require('./programBuilder.js');

updateNotifier({ pkg: pkg, callback: program }).notify();
