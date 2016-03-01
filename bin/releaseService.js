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
var _log;

var OS_TMP_DIR = os.tmpdir();
var DATE;
//temp - need to get this from the API
var ZIP_DOWNLOAD_URL = 'https://github.com/code-computerlove/cartridge/archive/v0.2.0-alpha.zip';
var ZIP_FILENAME;
var ZIP_FILEPATH;

releaseServiceApi.downloadLatestRelease = function(logInstance) {
	_log = logInstance;

	return preSetup()
		.then(getReleaseZipFromGitHub)
		.then(decompressZipFile)
		.then(deleteZipFile);
}

function preSetup() {
	date = new Date();
	ZIP_FILENAME = [date.getMilliseconds(), date.getDate(), date.getMonth()+1, date.getFullYear(), '-cartridge-tmp.zip'].join('');
	ZIP_FILEPATH = path.join(OS_TMP_DIR, ZIP_FILENAME);

	return Promise.resolve();
}

function getReleaseZipFromGitHub() {
	return new Promise(function(resolve, reject) {
		request(ZIP_DOWNLOAD_URL)
			.pipe(fs.createWriteStream(ZIP_FILEPATH))
			.on('close', function() {
				_log.debug('GitHub release zip downloaded from: ' + ZIP_DOWNLOAD_URL);
				_log.debug('GitHub release zip stored in path: ' + ZIP_FILEPATH);

				resolve();
			});
	})
}

function decompressZipFile() {
	return new Promise(function(resolve, reject) {
		fs.createReadStream(ZIP_FILEPATH)
			.pipe(unzip.Extract({ path: OS_TMP_DIR}))
			.on('close', function() {
				_log.debug('.zip file extracted');
				resolve()
			});
	})
}

function deleteZipFile() {
	return new Promise(function(resolve, reject) {
		fs.unlink(ZIP_FILEPATH, function() {
			_log.debug('.zip file deleted');
			resolve()
		})
	})
}

module.exports = releaseServiceApi;