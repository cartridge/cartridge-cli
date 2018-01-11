/* eslint-env node, mocha */

// Enable strict mode for older versions of node
// eslint-disable-next-line strict, lines-around-directive
'use strict';

const chai = require('chai');

const expect = chai.expect;

const utils = require('../bin/utils');

chai.should();

describe('As a user of the utils module', () => {
	describe('When using getLogInstance', () => {
		describe('And passing silent as an option', () => {
			it('should have a log level of silent', () => {
				const logInstance = utils.getLogInstance({ silent: true });
				const actual = logInstance.getLevel();
				const expected = logInstance.levels.SILENT;

				expect(actual).to.be.equal(expected);
			});
		});

		describe('And passing verbose as an option', () => {
			it('should have a log level of trace', () => {
				const logInstance = utils.getLogInstance({ verbose: true });
				const actual = logInstance.getLevel();
				const expected = logInstance.levels.TRACE;

				expect(actual).to.be.equal(expected);
			});
		});
	});
});
