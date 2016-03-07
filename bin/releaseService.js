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
var CARTRIDGE_TMP_DIR = path.join(OS_TMP_DIR, 'cartridge');

releaseServiceApi.downloadLatestRelease = function(logInstance) {
	_log = logInstance;

	_log.debug('Getting latest release URL from GitHub');

	return getCartridgeFolderPath({dest: OS_TMP_DIR});

	// return ensureTempDirExists()
	// 	.then(getLatestGitHubRelease)
	// 	.then(downloadGitHubZipFile)
	// 	.then(getCartridgeFolderPath)
}

function ensureTempDirExists() {
	return new Promise(function(resolve, reject) {
		fs.ensureDir(CARTRIDGE_TMP_DIR, function (err) {
			resolve();
		})
	});
}

function getCartridgeFolderPath(args) {
	var CARTRIDGE_FOLDER = /^cartridge-cartridge/;

	return new Promise(function(resolve, reject) {
		fs.readdir(args.dest, function(err, files) {

			for (var i = 0; i < files.length; i++) {

				if(CARTRIDGE_FOLDER.test(files[i])) {
					resolve(path.join(args.dest, files[i]));
				}
			}

			resolve(path.join(args.dest, files[0], '/'));
		})
	});
}

function downloadGitHubZipFile(downloadUrl) {
	return gotZip(downloadUrl, {
		dest:    OS_TMP_DIR,
		extract: true,
		cleanup: true,
		strip:   0
	})
}

function getLatestGitHubRelease() {
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
				resolve(data[0].zipball_url);
			}
		});
	});
}

module.exports = releaseServiceApi;
