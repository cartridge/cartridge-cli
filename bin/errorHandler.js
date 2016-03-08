var PrettyError = require('pretty-error');
var pe = new PrettyError();

/**
 * Main error handler function.
 * Outputs error on screen and exits program
 * @param  {Object} error Error object
 */
function errorHandler(error) {

	var prettyError = pe.render(new Error(error));

	console.error('');
	console.error(prettyError);

	process.exit(1);
}

/**
 * Set the on-screen theme for the PrettyError output
 */
function setPrettyErrrorTheme() {
	pe.appendStyle({
		'pretty-error > header > title > kind': {
			display: 'none'
		},

		// the 'colon' after 'Error':
		'pretty-error > header > colon': {
			display: 'none'
		},

		// our error message
		'pretty-error > header > message': {
			color: 'bright-white',
			//colour range red, green, yellow, blue, magenta, cyan, white,
			background: 'red',
			padding: '0 1' // top/bottom left/right
		},

		// each trace item ...
		'pretty-error > trace > item': {
			marginLeft: 2,
			marginBottom: 0,
			bullet: '"<grey>· </grey>"'
		},

		'pretty-error > trace > item > header > pointer > file': {
			color: 'yellow'
		},

		'pretty-error > trace > item > header > pointer > colon': {
			color: 'yellow'
		},

		'pretty-error > trace > item > header > pointer > line': {
			color: 'bright-cyan'
		},

		'pretty-error > trace > item > header > what': {
			color: 'bright-white'
		},

		'pretty-error > trace > item > footer > addr': {
			// display: 'none'
			marginLeft: 4
		}
	});
}

/**
 * Set PrettyError config
 */
function setPrettyErrorConfig() {
	pe.skipNodeFiles();
}

setPrettyErrrorTheme();
setPrettyErrorConfig();

module.exports = errorHandler