// Enable strict mode for older versions of node
// eslint-disable-next-line strict, lines-around-directive
'use strict';

const path = require('path');

const extend = require('extend');
/* eslint import/no-dynamic-require:0  */
const pkg = require(path.resolve(__dirname, '..', 'package.json'));

let templateData = {};
let templateBaseData;

const templateDataApi = {};

/**
 * Pad a date number if necessary e.g. 9 would be 09
 * @param  {Number} number The number to pad
 * @return {Number}        Padded number
 */
function padDateNumber(number) {
	return number <= 9 ? `0${number}` : number;
}

/**
 * Get the current DD/MM/YYYY formatted date
 * @return {String} Current date
 */
function getCurrentDateFormatted() {
	const date = new Date();
	const day = padDateNumber(date.getDate());
	const month = padDateNumber(date.getMonth() + 1);
	const year = padDateNumber(date.getFullYear());

	return [day, month, year].join('/');
}

/**
 * Generate extra meta data using the base data
 * @return {Object} Meta data object
 */
function getTemplateMetaData() {
	return {
		projectNameFileName: templateBaseData.projectName.toLowerCase().replace(/ /g, '-'),
		projectGeneratedDate: getCurrentDateFormatted(),
		currentVersion: pkg.version
	};
}

/**
 * Set internal template data
 * @param {Object} baseData Base template data object
 */
templateDataApi.setData = baseData => {
	templateBaseData = baseData;
	templateData = extend({}, templateBaseData, getTemplateMetaData());
};

/**
 * Get the template data
 * @return {Object} Template data
 */
templateDataApi.getData = () => templateData;

module.exports = templateDataApi;
