/* eslint-env node, mocha */
/* eslint no-unused-expressions: 0 */
/* eslint import/no-dynamic-require: 0 */

// Enable strict mode for older versions of node
// eslint-disable-next-line strict, lines-around-directive
'use strict';

const timekeeper = require('timekeeper');
const chai = require('chai');

const expect = chai.expect;

chai.should();

const path = require('path');

const pkg = require(path.resolve(__dirname, '..', 'package.json'));

describe('As a user of the template data manager module', () => {
	let templateDataManagerModule;

	beforeEach(() => {
		// eslint-disable-next-line global-require
		templateDataManagerModule = require('../bin/templateDataManager');

		// freeze the date to allow easy testing
		timekeeper.freeze(new Date(2016, 3, 5));
	});

	describe('When no data has been set', () => {
		it('should return an empty object', () => {
			const actual = templateDataManagerModule.getData();
			const expected = {};

			actual.should.eql(expected);
			actual.should.be.empty;
		});
	});

	describe('When the project name contains a space', () => {
		beforeEach(() => {
			templateDataManagerModule.setData({
				projectName: 's3 plan'
			});
		});

		it('should correctly replace the space with a dash for the projectNameFileName', () => {
			const actual = templateDataManagerModule.getData().projectNameFileName;
			const expected = 's3-plan';

			actual.should.equal(expected);
		});
	});

	describe('When the projectNameFileName is generated', () => {
		beforeEach(() => {
			templateDataManagerModule.setData({
				projectName: 'S3 PLAN'
			});
		});

		it('should be in lowercase', () => {
			const actual = templateDataManagerModule.getData().projectNameFileName;
			const expected = 's3-plan';

			actual.should.equal(expected);
		});
	});

	describe('When the template data is generated', () => {
		let templateData;

		beforeEach(() => {
			templateDataManagerModule.setData({
				projectName: 's3 plan'
			});

			templateData = templateDataManagerModule.getData();
		});

		it('should contain the data that was passed in', () => {
			const actual = templateData.projectName;

			expect(actual).to.exist;
		});

		it('should have a projectNameFileName key', () => {
			const actual = templateData.projectNameFileName;

			expect(actual).to.exist;
		});

		it('should have a projectGeneratedDate key', () => {
			const actual = templateData.projectGeneratedDate;

			expect(actual).to.exist;
		});

		it('should have a currentVersion key', () => {
			const actual = templateData.currentVersion;

			expect(actual).to.exist;
		});

		it('should have the correct projectGeneratedDate value', () => {
			const actual = templateData.projectGeneratedDate;
			const expected = '05/04/2016';

			actual.should.equal(expected);
		});

		it('should have the correct currentVersion value', () => {
			const actual = templateData.currentVersion;
			const expected = pkg.version;

			actual.should.equal(expected);
		});
	});
});
