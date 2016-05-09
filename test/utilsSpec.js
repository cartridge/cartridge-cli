var chai = require('chai');
var expect = chai.expect;

var utils = require('../bin/utils');

chai.should();

describe('As a user of the utils module', function() {

	describe('When using getLogInstance', function() {

		describe('And passing silent as an option', function() {

			it('should have a log level of silent', function() {
				var logInstance = utils.getLogInstance({ silent: true });
				var actual = logInstance.getLevel();
				var expected = logInstance.levels.SILENT;

				expect(actual).to.be.equal(expected);
			})
		})

		describe('And passing verbose as an option', function() {

			it('should have a log level of trace', function() {
				var logInstance = utils.getLogInstance({ verbose: true });
				var actual = logInstance.getLevel();
				var expected = logInstance.levels.TRACE;

				expect(actual).to.be.equal(expected);
			})
		})

	})

})