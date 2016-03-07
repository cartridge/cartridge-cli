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

utilsApi.filterDirectoryContents = function(unfilteredFileList) {
	var filesToExclude = ['.DS_Store'];
	var filteredDirContents = [];

	for (var i = 0; i < unfilteredFileList.length; i++) {
		//if the file / folder IS NOT part of the exclude list, then add it to the filtered dir content list
		if(!inArray(filesToExclude, unfilteredFileList[i])) {
			filteredDirContents.push(unfilteredFileList[i]);
		}
	}

	return filteredDirContents;
}

module.exports = utilsApi;