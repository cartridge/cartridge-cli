"use strict";

var log = require('loglevel');
var inArray = require('in-array');

var utilsApi = {};

/**
 * Set the internal log level and return a log module instance
 * @param  {Object} options Command line options e.g silent, verbose
 * @return {Object}         Log module instance
 */
utilsApi.getLogInstance = function(options) {
	if(options.silent) {
		log.setLevel(log.levels.SILENT);
	} else if(options.verbose) {
		log.setLevel(log.levels.TRACE);
	} else {
		log.setLevel(log.levels.INFO);
	}

	return log;
}

module.exports = utilsApi;