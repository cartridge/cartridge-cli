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

releaseServiceApi.downloadLatestRelease = function() {
	return getReleaseZipFromGitHub()
		.then(decompressZipFile)
		.then(deleteZipFile)
}

function getReleaseZipFromGitHub() {
	var date = new Date();
	var ZIP_FILENAME = [date.getMilliseconds(), date.getDate(), date.getMonth(), date.getFullYear(), '-cartridge-tmp.zip'].join('');
	var ZIP_FILE_LOCATION = path.join(os.tmpDir(), ZIP_FILENAME );

	return new Promise(function(resolve, reject) {
		request('https://github.com/code-computerlove/cartridge/archive/v0.3.0-alpha.zip')
			.pipe(fs.createWriteStream(ZIP_FILE_LOCATION))
			.on('close', function() {
				resolve(ZIP_FILE_LOCATION);
			});
	})


}

function decompressZipFile(zipLocation) {
console.log(zipLocation);
	return new Promise(function(resolve, reject) {
		fs.createReadStream(zipLocation)
			.pipe(unzip.Extract({ path: path.join(os.tmpDir())}))
			.on('close', function() {
				resolve(zipLocation)
			});
	})

}

function deleteZipFile(zipLocation) {
	return new Promise(function(resolve, reject) {
		fs.unlink(zipLocation, function() {
			resolve()
		})
	})
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
