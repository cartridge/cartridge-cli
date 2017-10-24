"use strict";

var http = require('http');

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

utilsApi.checkIfOnline = function() {
	return new Promise(function(resolve, reject) {

		http.get('http://captive.apple.com/hotspot-detect.html', function(response, one, two) {

			if(response.statusCode < 400) {
				resolve()
			} else {
				reject()
			}
		}).on('error', function(error) {
			reject();
		});
	});
}

module.exports = utilsApi;