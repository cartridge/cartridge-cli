var os = require('os');
var path = require('path');

var fs = require('fs-extra');
var request = require('request');
var unzip = require('unzip');
var GitHubApi = require('github');
var github = new GitHubApi({
    version: "3.0.0",
    protocol: "https",
    headers: {
        "user-agent": "cartridge-cli-app"
    }
});

var releaseServiceApi = {};
var _callback;

releaseServiceApi.downloadLatestRelease = function(callback) {
	_callback = callback || function() {};
	var date = new Date();
	var ZIP_FILEANME = [date.getMilliseconds(), date.getDate(), date.getMonth(), date.getFullYear(), '-cartridge-tmp.zip'].join('');
	var ZIP_FILE_LOCATION = path.join(os.tmpDir(), ZIP_FILEANME );

	request('https://github.com/code-computerlove/cartridge/archive/v0.2.0-alpha.zip')
		.pipe(fs.createWriteStream(ZIP_FILE_LOCATION))
		.on('close', function() {
			decompressZipFile(ZIP_FILE_LOCATION)
		});
}

function decompressZipFile(zipLocation) {
	fs.createReadStream(zipLocation)
		.pipe(unzip.Extract({ path: path.join(os.tmpDir())}))
		.on('close', function() {
			fs.unlink(zipLocation, _callback)
		});
}

// function getLatestCartridgeReleaseFromGitHub() {
// 	github.releases.getRelease({
// 		owner: 'code-computerlove',
// 		repo: 'cartridge',
// 		id: '2697137'
// 	}, function(err, data) {
// 		if(err) console.error(data);

// 		downloadReleaseFromGitHub(data.tarball_url);
// 	})
// }

module.exports = releaseServiceApi;