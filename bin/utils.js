var log = require('loglevel');

var utilsApi = {};

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