var chai = require('chai');
var expect = chai.expect;

var promptModuleOptionsModule = require('../bin/promptModuleOptions');

chai.should();

describe('As a user of the prompt module options module', function() {

	var moduleOptionsData;

	before(function() {
		promptModuleOptionsModule.setup({
			silent: true
		});
	})

	describe('When getting prompt options data', function() {

		beforeEach(function(done) {

			promptModuleOptionsModule
				.getOptions()
				.then(function(moduleData) {
					moduleOptionsData = moduleData;
					done();
				})
		})

		it('should return an array', function() {
			expect(moduleOptionsData).to.be.a('array');
		})

	})

})