"use strict";

var path = require('path');

var extend = require('extend');
var pkg = require(path.resolve(__dirname, '..' ,'package.json'));

var _templateData;
var _promptAnswers;

var templateDataApi = {};

templateDataApi.setData = function(promptAnswers) {
	_promptAnswers = promptAnswers;
	_templateData = extend({}, _promptAnswers, getTemplateMetaData())
}

templateDataApi.getData = function() {
	return _templateData;
}

function getTemplateMetaData() {
	var date = new Date();

	return {
		projectNameFileName:  _promptAnswers.projectName.toLowerCase().replace(/ /g,"-"),
		projectGeneratedDate: [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/'),
		currentVersion:       pkg.version
	}

}

module.exports = templateDataApi;