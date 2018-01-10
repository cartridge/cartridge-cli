// Enable strict mode for older versions of node
// eslint-disable-next-line strict, lines-around-directive
'use strict';

const http = require('http');
const log = require('loglevel');

const utilsApi = {};

/**
 * Set the internal log level and return a log module instance
 * @param  {Object} options Command line options e.g silent, verbose
 * @return {Object}         Log module instance
 */
utilsApi.getLogInstance = (options) => {
	if(options.silent) {
		log.setLevel(log.levels.SILENT);
	} else if(options.verbose) {
		log.setLevel(log.levels.TRACE);
	} else {
		log.setLevel(log.levels.INFO);
	}

	return log;
}

utilsApi.checkIfOnline = () => new Promise((resolve, reject) => {

    http.get('http://captive.apple.com/hotspot-detect.html', (response) => {

        if(response.statusCode < 400) {
            resolve()
        } else {
            reject()
        }
    }).on('error', (error) => {
        reject(error);
    });
})

module.exports = utilsApi;
