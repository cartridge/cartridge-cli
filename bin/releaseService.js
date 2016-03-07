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
var CARTRIDGE_FOLDER_REGEX = /^cartridge-cartridge/;
var CARTRIDGE_FOLDER_PATH;

releaseServiceApi.downloadLatestRelease = function(logInstance) {
	_log = logInstance;

	return getLatestGitHubRelease()
		.then(downloadGitHubZipFile)
		.then(getCartridgeFolderPath)
		.catch(function(err) {
			return console.err(err);
		})
}

releaseServiceApi.deleteReleaseTmpDirectory = function() {
	_log.debug('Deleting cartridge temp directory in ' + OS_TMP_DIR);

	fs.removeSync(CARTRIDGE_FOLDER_PATH)
}

function getCartridgeFolderPath(args) {

	return new Promise(function(resolve, reject) {
		fs.readdir(args.dest, function(err, files) {

			for (var i = 0; i < files.length; i++) {

				if(CARTRIDGE_FOLDER_REGEX.test(files[i])) {
					CARTRIDGE_FOLDER_PATH = path.join(args.dest, files[i])
					resolve(CARTRIDGE_FOLDER_PATH);
				}
			}
		})
	});
}

function downloadGitHubZipFile(downloadUrl) {
	_log.debug('Downloading release from URL ' + downloadUrl);

	return gotZip(downloadUrl, {
		dest:    OS_TMP_DIR,
		extract: true,
		cleanup: true,
		strip:   0
	})
}

function getLatestGitHubRelease() {
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

			if(data.length > 0) {
				resolve(data[0].zipball_url);
			}
		});
	});
}

module.exports = releaseServiceApi;
