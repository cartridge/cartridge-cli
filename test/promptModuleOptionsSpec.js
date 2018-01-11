/* eslint-env node, mocha */
/* eslint no-unused-expressions: 0 */

// Enable strict mode for older versions of node
// eslint-disable-next-line strict, lines-around-directive
'use strict';

const chai = require('chai');

const { expect, assert } = chai;

const promptModuleOptionsModule = require('../bin/promptModuleOptions');

chai.should();

describe('As a user of the prompt module options module', function suite() {
	let moduleOptionsData;

	this.timeout(5000);

	before(() => {
		promptModuleOptionsModule.setup({
			silent: true
		});
	});

	describe('When getting module data', () => {
		beforeEach(done => {
			promptModuleOptionsModule.getOptions().then(moduleData => {
				moduleOptionsData = moduleData;
				done();
			});
		});

		it('should return an array', () => {
			expect(moduleOptionsData).to.be.a('array');
		});

		it('should return a collection (array of objects)', () => {
			moduleOptionsData.forEach(singleModule => {
				expect(singleModule).to.be.a('object');
			});
		});
	});

	describe('When reading each module object', () => {
		it('should have the `name` key', () => {
			moduleOptionsData.forEach(singleModule => {
				expect(singleModule.name).to.exist;
			});
		});

		it('should contain the `name` key and be string', () => {
			moduleOptionsData.forEach(singleModule => {
				expect(singleModule.name).to.be.a('string');
			});
		});

		it('should have the `checked` key', () => {
			moduleOptionsData.forEach(singleModule => {
				expect(singleModule.checked).to.exist;
			});
		});

		it('should have the `checked` key and be boolean', () => {
			moduleOptionsData.forEach(singleModule => {
				assert.isBoolean(singleModule.checked);
			});
		});
	});
});
