var chai = require('chai');
var expect = chai.expect;

chai.should();

describe('As a user of the template data manager module', function() {
	var templateDataManagerModule;

	beforeEach(function() {
		templateDataManagerModule = require('../../bin/templateDataManager');
	})

	describe('When no data has been set', function() {

		it('should return an empty object', function() {
			var actual = templateDataManagerModule.getData();
			var expected = {};

			actual.should.eql(expected);
		})

	})

	describe('When the project name file name contains a space', function() {

		beforeEach(function() {
			templateDataManagerModule.setData({
				projectName: 's3 plan'
			})
		})

		it('should correctly replace the space with a dash', function() {
			var actual = templateDataManagerModule.getData().projectNameFileName;
			var expected = 's3-plan';

			actual.should.equal(expected);

		})

	})

	describe('When the project name file is generated', function() {

		beforeEach(function() {
			templateDataManagerModule.setData({
				projectName: 'S3 PLAN'
			})
		})

		it('should be in lowercase', function() {
			var actual = templateDataManagerModule.getData().projectNameFileName;
			var expected = 's3-plan';

			actual.should.equal(expected);

		})

	})

})