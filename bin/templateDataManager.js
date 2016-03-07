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
	return {
		projectNameFileName:  _baseData.projectName.toLowerCase().replace(/ /g,"-"),
		projectGeneratedDate: getCurrentDateFormatted(),
		currentVersion:       pkg.version
	}

}
/**
 * Get the current DD/MM/YYYY formatted date
 * @return {String} Current date
 */
function getCurrentDateFormatted() {
	var date = new Date();
	var day = padDateNumber(date.getDate());
	var month = padDateNumber(date.getMonth() + 1);
	var year = padDateNumber(date.getFullYear());

	return [day, month, year].join('/');
}

/**
 * Pad a date number if necessary e.g. 9 would be 09
 * @param  {Number} number The number to pad
 * @return {Number}        Padded number
 */
function padDateNumber(number) {
	return number <= 9 ? '0' + number : number;
}

module.exports = templateDataApi;