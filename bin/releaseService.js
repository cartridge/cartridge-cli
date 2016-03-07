"use strict";

var os   = require('os');
var path = require('path');

var fs        = require('fs-extra');
var gotZip    = require('got-zip');
var GitHubApi = require('github');

var github = new GitHubApi({
	version: '3.0.0',
	protocol: 'https',
	headers: {
		'user-agent': 'cartridge-cli-app'
	}
});

var releaseServiceApi = {};
var _log;

var OS_TMP_DIR       = os.tmpdir();
var DATE;
//temp - need to get this from the API
var ZIP_DOWNLOAD_URL = 'https://github.com/code-computerlove/cartridge/archive/v0.3.2-alpha.zip';
var ZIP_FILENAME;
var ZIP_FILEPATH;

function handleGithubResponse(url, downloadDir) {
	return gotZip(url, {
		dest:    downloadDir,
		extract: true,
		cleanup: true,
		strip:   0
	})
		.catch(function (err) {
			// manage error
		});
}

releaseServiceApi.downloadLatestRelease = function(logInstance, downloadDir) {
	_log = logInstance;

	_log.debug('Getting latest release URL from GitHub');

	return new Promise(function(resolve, reject) {
		github.releases.listReleases({
			owner:    'cartridge',
			repo:     'cartridge',
			page:     1,
			per_page: 1
		}, function(err, data) {
			if(err) reject(err);
			_log.debug('Release ' + data[0].name + ' is latest');
			_log.debug('Downloading release from URL ' + data[0].zipball_url);

			if(data.length > 0) {
				console.log('after github pre download: ' + downloadDir);
				resolve(handleGithubResponse(data[0].zipball_url, downloadDir));
			}
		});
	});
}

function preSetup() {
	DATE = new Date();
	ZIP_FILENAME = [DATE.getMilliseconds(), DATE.getDate(), DATE.getMonth()+1, DATE.getFullYear(), '-cartridge-tmp.zip'].join('');
	ZIP_FILEPATH = path.join(OS_TMP_DIR, ZIP_FILENAME);

	return Promise.resolve();
}

function getReleaseZipFromGitHub() {
	return new Promise(function(resolve, reject) {
		got(ZIP_DOWNLOAD_URL)
			.pipe(fs.createWriteStream(ZIP_FILEPATH))
			.on('close', function() {
				_log.debug('GitHub release zip downloaded from: ' + ZIP_DOWNLOAD_URL);
				_log.debug('GitHub release zip stored in path: ' + ZIP_FILEPATH);

				resolve();
			});
	})
}

function extractZipFile() {
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
