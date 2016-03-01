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

var OS_TMP_DIR = os.tmpdir();
var DATE;
var ZIP_FILENAME;
var ZIP_FILE_LOCATION;

releaseServiceApi.downloadLatestRelease = function() {
	return preSetup()
		.then(getReleaseZipFromGitHub)
		.then(decompressZipFile)
		.then(deleteZipFile);
}

function preSetup() {
	date = new Date();
	ZIP_FILENAME = [date.getMilliseconds(), date.getDate(), date.getMonth()+1, date.getFullYear(), '-cartridge-tmp.zip'].join('');
	ZIP_FILE_LOCATION = path.join(OS_TMP_DIR, ZIP_FILENAME);

	return Promise.resolve();
}

function getReleaseZipFromGitHub() {
	return new Promise(function(resolve, reject) {
		request('https://github.com/code-computerlove/cartridge/archive/v0.2.0-alpha.zip')
			.pipe(fs.createWriteStream(ZIP_FILE_LOCATION))
			.on('close', function() {
				resolve();
			});
	})
}

function decompressZipFile() {
	return new Promise(function(resolve, reject) {
		fs.createReadStream(ZIP_FILE_LOCATION)
			.pipe(unzip.Extract({ path: OS_TMP_DIR}))
			.on('close', function() {
				resolve()
			});
	})
}

function deleteZipFile() {
	return new Promise(function(resolve, reject) {
		fs.unlink(ZIP_FILE_LOCATION, function() {
			resolve()
		})
	})
}

module.exports = releaseServiceApi;