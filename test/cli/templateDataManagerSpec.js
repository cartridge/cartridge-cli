var chai = require('chai');
var expect = chai.expect;

chai.should();

var path = require('path');
var pkg = require(path.resolve(__dirname, '..', '..', 'package.json'));

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
			actual.should.be.empty;
		})

	})

	describe('When the project name contains a space', function() {

		beforeEach(function() {
			templateDataManagerModule.setData({
				projectName: 's3 plan'
			})
		})

		it('should correctly replace the space with a dash for the projectNameFileName', function() {
			var actual = templateDataManagerModule.getData().projectNameFileName;
			var expected = 's3-plan';

			actual.should.equal(expected);

		})

	})

	describe('When the projectNameFileName is generated', function() {

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

	describe('When the template data is generated', function() {

		var templateData;

		beforeEach(function() {
			templateDataManagerModule.setData({
				projectName: 's3 plan'
			})

			templateData = templateDataManagerModule.getData();
		})

		it('should have a projectNameFileName key', function() {
			var actual = templateData.projectNameFileName;

			expect(actual).to.exist;
		})

		it('should have a projectGeneratedDate key', function() {
			var actual = templateData.projectGeneratedDate;

			expect(actual).to.exist;
		})

		it('should have a currentVersion key', function() {
			var actual = templateData.currentVersion;

			expect(actual).to.exist;
		})

		it('should have the correct projectGeneratedDate value', function() {
			var date = new Date();
			var actual = templateData.projectGeneratedDate;
			var expected = [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/');

			actual.should.equal(expected);
		})

		it('should have the correct currentVersion value', function() {
			var actual = templateData.currentVersion;
			var expected = pkg.version;

			actual.should.equal(expected);
		})

	})
})