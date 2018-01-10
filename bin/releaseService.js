// Enable strict mode for older versions of node
// eslint-disable-next-line strict, lines-around-directive
'use strict';

const os   = require('os');
const path = require('path');

const fs        = require('fs-extra');
const gotZip    = require('got-zip');
const GitHubApi = require('github');

const github = new GitHubApi({
	version: '3.0.0',
	protocol: 'https',
	headers: {
		'user-agent': 'cartridge-cli-app'
	}
});

const utils = require('./utils');
const errorHandler = require('./errorHandler');

const releaseServiceApi = {};
let log;

const OS_TMP_DIR = os.tmpdir();
const CARTRIDGE_FOLDER_REGEX = /^cartridge-cartridge/;
let CARTRIDGE_FOLDER_PATH;

/**
 * Get the full cartridge temp directory path
 * @param  {Object} args gotZip argument object
 */
function getCartridgeFolderPath(args) {

	return new Promise((resolve, reject) => {
		fs.readdir(args.dest, (err, files) => {

			if(err) reject(err);

			for (let i = 0; i < files.length; i += 1) {

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
	log.debug(`Downloading release from URL ${downloadUrl}`);
	log.debug('');

	return gotZip(downloadUrl, {
		dest:    OS_TMP_DIR,
		extract: true,
		cleanup: true,
		strip:   0
	})
}
function gitHubApiCallback(resolve, reject, err, data) {
	if(err) {
		return reject(err);
	}

	log.debug(`Release ${data[0].name} is latest`);

	if(data.length > 0) {
		return resolve(data[0].zipball_url);
	}
}

/**
 * Get the latest github release data
 */
function getLatestGitHubRelease() {
	log.debug('Getting latest release URL from GitHub');

	return new Promise((resolve, reject) => {
		github.releases.listReleases({
			owner:    'cartridge',
			repo:     'cartridge',
			page:     1,
			per_page: 1
		}, (err, data) => gitHubApiCallback(resolve, reject, err, data));
	});
}

/**
 * Download the latest cartridge release from github
 * @param  {Object} logInstance Log module instance used for internal logging
 */
releaseServiceApi.downloadLatestRelease = options => {
	log = utils.getLogInstance(options);

	return getLatestGitHubRelease()
		.then(downloadGitHubZipFile)
		.then(getCartridgeFolderPath)
		.catch(err => {
			errorHandler(err)
		})
}

/**
 * Delete the temp release directory
 */
releaseServiceApi.deleteReleaseTmpDirectory = () => {
	log.debug(`Deleting cartridge temp directory in ${OS_TMP_DIR}`);

	fs.removeSync(CARTRIDGE_FOLDER_PATH)
}

module.exports = releaseServiceApi;
