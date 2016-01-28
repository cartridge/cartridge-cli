var path = require('path');
var templateData = require(path.resolve(__dirname, '..', '_config', 'templateData.json'));
var templateHelpers = require(path.resolve(__dirname, '..', '_config', 'templateHelpers.js'))();
var coloursSass = __dirname + '/../_source/styles/_settings/_settings.colors.scss';
var fs = require('fs');

var WebsiteController = function (website) {
	// Public functions
	var website = website;
	this.get = function(request, response) {
		if (!request.body) return response.sendStatus(400);
		var url = parseUrl(request.params[0]);
		
		if(url === 'styleguide'){
			response.render(url, createStyleGuide());
			return;
		}

		response.render(url, createModel());
	};

	function createModel(params){
		var model = {
			layout: false,
			data: templateData,
			helpers: templateHelpers
		}

		return model;
	}

	function parseUrl(url){
		if(url === '/' || url === '' || url === undefined || url === 'favicon.ico'){
			// this acts as the default view file when working locally
			url = 'index'
		}
		return url;
	}

	function getFileContents(file){

		var colorItem;
    var regHex = /#\w+;/g;
    var colArr = [];

		var file = fs.readFile(file, 'utf8', function (err,data) {

      while (colorItem = regHex.exec(data)){
				var color = colorItem[0].replace(';','');
				if(colArr.indexOf(color) === -1){ 
	    		colArr.push(color);
	    	}
	  	}

	  	return data;

    });

		return colArr;
	}

	function createStyleGuide(response, url){

		var colorItem;
    var regHex = /#\w+;/g;
    var colArr = getFileContents(coloursSass);

		var model = {
			layout: false,
			data: templateData,
			helpers: templateHelpers,
			colors: colArr
		}
		return model;
	}

};

module.exports = function(website) {
	var controller = new WebsiteController(website);
	website.get(['/*','/:loc'], controller.get);

};