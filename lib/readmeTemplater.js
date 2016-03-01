'use strict';

var template        = require('lodash/template');
var fs              = require('fs');
var modulesTemplate = require('../templates/modules.tpl');
var readmeTemplate  = require('../templates/readme.tpl');

var readmePath = 'readme.md';

var apiObject = {};

function updateReadme(newContents, callback) {
	fs.writeFile(filePath, output, 'utf8', function(err) {
		 if (err) return console.error(err)

		 _config.onEachFile(filePath);

		 if(_fileNumber === _config.files.length) {
			  _config.onCompleted();
		 }

		 _fileNumber++;

	});
}

apiObject.setPath = function setPath(path) {
	console.log(modulesTemplate);
	readmePath = path + readmePath;
	console.log(readmePath);
}

module.exports = apiObject;
