/* eslint-env node, mocha */
/* eslint no-unused-expressions: 0 */

// Enable strict mode for older versions of node
// eslint-disable-next-line strict, lines-around-directive
'use strict';

const chai = require('chai');

const { expect } = chai;

const promptOptionsModule = require('../bin/promptOptions');

chai.should();

describe('As a user of the promptOptions module', function suite() {
	it('should return an object', () => {
		const test = promptOptionsModule;

		expect(test).to.be.a('object');
	});

	describe('When using getNewCommandPromptOptions()', () => {
		before(() => {
			promptOptionsModule.setup({
				silent: true
			});
		});

		it('should be a function', () => {
			const test = promptOptionsModule.getNewCommandPromptOptions;

			expect(test).to.be.a('function');
		});

		it('should return an array', done => {
			promptOptionsModule.getNewCommandPromptOptions().then(promptOptions => {
				expect(promptOptions instanceof Array).to.be.true;
				done();
			});
		});

		it('should return an array that is not empty', done => {
			promptOptionsModule.getNewCommandPromptOptions().then(promptOptions => {
				expect(promptOptions.length).to.be.above(1);
				done();
			});
		});
	});
});
