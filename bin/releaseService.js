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

var errorHandler = require('./errorHandler');

var releaseServiceApi = {};
var _log;

var OS_TMP_DIR       = os.tmpdir();
var CARTRIDGE_FOLDER_REGEX = /^cartridge-cartridge/;
var CARTRIDGE_FOLDER_PATH;

/**
 * Download the latest cartridge release from github
 * @param  {Object} logInstance Log module instance used for internal logging
 */
releaseServiceApi.downloadLatestRelease = function(logInstance) {
	_log = logInstance;

	return getLatestGitHubRelease()
		.then(downloadGitHubZipFile)
		.then(getCartridgeFolderPath)
		.catch(function(err) {
			errorHandler(err)
		})
}

/**
 * Delete the temp release directory
 */
releaseServiceApi.deleteReleaseTmpDirectory = function() {
	_log.debug('Deleting cartridge temp directory in ' + OS_TMP_DIR);

	fs.removeSync(CARTRIDGE_FOLDER_PATH)
}

/**
 * Get the full cartridge temp directory path
 * @param  {Object} args gotZip argument object
 */
function getCartridgeFolderPath(args) {

	return new Promise(function(resolve, reject) {
		fs.readdir(args.dest, function(err, files) {

			if(err) reject(err);

			for (var i = 0; i < files.length; i++) {

				if(CARTRIDGE_FOLDER_REGEX.test(files[i])) {
					CARTRIDGE_FOLDER_PATH = path.join(args.dest, files[i])
					resolve(CARTRIDGE_FOLDER_PATH);
				}
			}
		})
	});
}

/**
 * Download the latest github release zip, store in OS temp directory
 * @param  {String} downloadUrl Download URL
 */
function downloadGitHubZipFile(downloadUrl) {
	_log.debug('Downloading release from URL ' + downloadUrl);
	_log.debug('');

	return gotZip(downloadUrl, {
		dest:    OS_TMP_DIR,
		extract: true,
		cleanup: true,
		strip:   0
	})
}

/**
 * Get the latest github release data
 */
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
