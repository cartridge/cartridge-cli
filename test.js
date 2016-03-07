
var releaseService = require('./bin/releaseService.js');
var utils          = require('./bin/utils.js');
var os             = require('os');
var path           = require('path');
var appDir         = path.resolve(__dirname,  'tmp');
// var appDir  = path.resolve(os.tmpDir(), 'cartridge');

var _log = utils.getLogInstance( {
	silent: false,
	verbose: true
});
releaseService
	.downloadLatestRelease(_log, appDir)
	.then(function(arg1){
		console.log('finished');
		console.log(arg1);
	});
