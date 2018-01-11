/* eslint-env node, mocha */
/* eslint no-unused-expressions: 0 */

// Enable strict mode for older versions of node
// eslint-disable-next-line strict, lines-around-directive
'use strict';

const sinon = require('sinon');
const chai = require('chai');
const os = require('os');
const fs = require('fs-extra');
const path = require('path');

const fileTemplater = require('../bin/fileTemplater');

chai.use(require('chai-fs'));

chai.should();

const TEST_TEMP_DIR = path.join(os.tmpdir(), 'file-templater');

function changeToOsTempDirAndCopyFixtures() {
	fs.ensureDirSync(TEST_TEMP_DIR);
	fs.copySync(path.resolve('./', 'test', 'fixtures', 'templateFiles'), TEST_TEMP_DIR);
	process.chdir(TEST_TEMP_DIR);
}

function tearDown() {
	fs.removeSync(TEST_TEMP_DIR);
}

function getTemplateData() {
	return {
		answer: "La Li Lu Le Lo",
		modelName: "Metal Gear Ray"
	}
}

describe('As a user of the file templater module', () => {
	before(changeToOsTempDirAndCopyFixtures);
	after(tearDown)

	describe('When templating one file', () => {

		const onEachFileSpy = sinon.spy();
		const templateData = getTemplateData();
		const fileList = [];

		before(done => {

			fileList.push({
				src: path.join(TEST_TEMP_DIR, 'creds.tpl'),
				dest: path.join(TEST_TEMP_DIR, 'creds-templated.json')
			})

			fileTemplater().run({
				data: templateData,
				basePath: process.cwd(),
				files: fileList,
				onEachFile: onEachFileSpy
			}).then(() => {
				done();
			})
		})

		it('should correctly create the templated file', () => {
			const templatedFilePath = path.join(TEST_TEMP_DIR, 'creds-templated.json');

			templatedFilePath.should.be.a.file();
		})

		it('should correctly template the contents with template data', () => {
			const templatedFilePath = path.join(TEST_TEMP_DIR, 'creds-templated.json');
			const templateFileContents = fs.readFileSync(templatedFilePath, 'utf8');
			const templateFileJson = JSON.parse(templateFileContents);

			templateFileJson.answer.should.equal(templateData.answer)
		})

    it('should not delete source file when `deleteSrcFile` is not provided', () => {
      const srcTemplateFile = path.join(TEST_TEMP_DIR, 'creds.tpl');

      srcTemplateFile.should.be.a.path();
    })

		it('should have called the onEachFile callback once', () => {
			onEachFileSpy.calledOnce.should.be.true;
		})

	})

	describe('When templating multiple files', () => {

		const onEachFileSpy = sinon.spy();
		const templateData = getTemplateData();
		const fileList = [];

		before(done => {

			fileList.push({
				src: path.join(TEST_TEMP_DIR, 'creds.tpl'),
				dest: path.join(TEST_TEMP_DIR, 'creds-templated.json')
			})

			fileList.push({
				src: path.join(TEST_TEMP_DIR, 'creds-again.tpl'),
				dest: path.join(TEST_TEMP_DIR, 'creds-again-templated.json'),
        deleteSrcFile: false
			})

      fileList.push({
        src: path.join(TEST_TEMP_DIR, 'fileToBeDeleted.tpl'),
        dest: path.join(TEST_TEMP_DIR, 'fileToBeDeleted-templated.json'),
        deleteSrcFile: true
      })

			fileTemplater().run({
				data: templateData,
				basePath: process.cwd(),
				files: fileList,
				onEachFile: onEachFileSpy
			}).then(() => {
				done();
			})
		})

		it('should have called the onEachFile callback thrice', () => {
			onEachFileSpy.calledThrice.should.be.true;
		})

    it('should not deleted source file when `deleteSrcFile` is not provided', () => {
      const srcTemplateFile = path.join(TEST_TEMP_DIR, 'creds.tpl');

      srcTemplateFile.should.be.a.path();
    })

    it('should not delete source file when `deleteSrcFile` is set to false', () => {
      const srcTemplateFile = path.join(TEST_TEMP_DIR, 'creds-again.tpl');

      srcTemplateFile.should.be.a.path();
    })

    it('should delete `fileToBeDeleted.tpl` when `deleteSrcFile` is set to true', () => {
      const srcTemplateFile = path.join(TEST_TEMP_DIR, 'fileToBeDeleted.tpl');

      srcTemplateFile.should.not.be.a.path();
    })

	})

})
