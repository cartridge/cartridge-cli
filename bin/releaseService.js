var os = require('os');

var Decompress = require('decompress');
var GitHubApi = require('github');
var github = new GitHubApi({
    version: "3.0.0",
    protocol: "https",
    headers: {
        "user-agent": "cartridge-cli-app"
    }
});

var releaseServiceApi = {};

releaseServiceApi.getLatestCartridgeReleaseFromGitHub() {
	github.releases.getRelease({
		owner: 'code-computerlove',
		repo: 'cartridge',
		id: '2697137'
	}, function(err, data) {
		if(err) console.error(data);

		downloadReleaseFromGitHub(data.tarball_url);
	})
}

releaseServiceApi.downloadReleaseFromGitHub(tarballUrl) {
	var osTmpDir = os.tmpdir();

	new Decompress({mode: '755'})
	    .src(tarballUrl)
	    .dest('dest')
	    .use(Decompress.zip({strip: 1}))
	    .run();
}

module.exports = releaseServiceApi;