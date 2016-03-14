var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

var promptModuleOptionsModule = require('../bin/promptModuleOptions');

chai.should();

describe('As a user of the prompt module options module', function() {

	var moduleOptionsData;

	this.timeout(5000);

	before(function() {
		promptModuleOptionsModule.setup({
			silent: true
		});
	})

	describe('When getting module data', function() {

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

		it('should return a collection (array of objects)', function() {
			moduleOptionsData.forEach(function(singleModule) {
				expect(singleModule).to.be.a('object');
			})
		})

	})

	describe('When reading each module object', function() {

		it('should have the `name` key', function() {
			moduleOptionsData.forEach(function(singleModule) {
				expect(singleModule.name).to.exist;
			})
		})

		it('should contain the `name` key and be string', function() {
			moduleOptionsData.forEach(function(singleModule) {
				expect(singleModule.name).to.be.a('string');
			})
		})

		it('should have the `checked` key', function() {
			moduleOptionsData.forEach(function(singleModule) {
				expect(singleModule.checked).to.exist;
			})
		})

		it('should have the `checked` key and be boolean', function() {
			moduleOptionsData.forEach(function(singleModule) {
				assert.isBoolean(singleModule.checked)
			})
		})

	})

})