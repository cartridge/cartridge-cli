"use strict";

var path = require('path');

var extend = require('extend');
var pkg = require(path.resolve(__dirname, '..' ,'package.json'));

var _templateData = {};
var _baseData;

var templateDataApi = {};

/**
 * Set internal template data
 * @param {Object} baseData Base template data object
 */
templateDataApi.setData = function(baseData) {
	_baseData = baseData;
	_templateData = extend({}, _baseData, getTemplateMetaData())
}

/**
 * Get the template data
 * @return {Object} Template data
 */
templateDataApi.getData = function() {
	return _templateData;
}

/**
 * Generate extra meta data using the base data
 * @return {Object} Meta data object
 */
function getTemplateMetaData() {
	var date = new Date();

	return {
		projectNameFileName:  _baseData.projectName.toLowerCase().replace(/ /g,"-"),
		projectGeneratedDate: [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/'),
		currentVersion:       pkg.version
	}

}

module.exports = templateDataApi;