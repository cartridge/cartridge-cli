'use strict';

function getConfig(paths) {
	var _DIR = '/';

	var config =  {
		src: {
			components: paths.dirs.components + _DIR,
			fonts:      paths.src + _DIR + paths.dirs.fonts + _DIR,
			images:     paths.src + _DIR + paths.dirs.images + _DIR,
			scripts:    paths.src + _DIR + paths.dirs.scripts + _DIR,
			styles:     paths.src + _DIR + paths.dirs.styles + _DIR
		},
		dest: {
			fonts:   paths.dest + _DIR + paths.dirs.fonts + _DIR,
			images:  paths.dest + _DIR + paths.dirs.images + _DIR,
			scripts: paths.dest + _DIR + paths.dirs.scripts + _DIR,
			styles:  paths.dest + _DIR + paths.dirs.styles + _DIR
		}
	};

	return config;
}

module.exports = getConfig;