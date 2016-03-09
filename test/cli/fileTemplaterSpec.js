var chai = require('chai');
var os = require('os');
var fs = require('fs-extra');
var path = require('path');

var fileTemplater =  require('../../bin/fileTemplater');

chai.use(require('chai-fs'));
chai.should();

var TEST_TEMP_DIR = path.join(os.tmpdir(), 'file-templater');


function changeToOsTempDirAndCopyFixtures() {
    fs.ensureDirSync(TEST_TEMP_DIR);
    fs.copySync(path.resolve('./', 'test', 'cli', 'fixtures', 'templateFiles'), TEST_TEMP_DIR);
    process.chdir(TEST_TEMP_DIR);
}

function tearDown() {
	fs.removeSync(TEST_TEMP_DIR);
}

describe('As a user of the file templater module', function() {
    before(changeToOsTempDirAndCopyFixtures);
    after(tearDown)

    describe('When templating one file', function() {

    	var templateData = {
    		answer: "La Li Lu Le Lo"
    	};

    	var fileList = [];

    	before(function(done) {

    		fileList.push({
    			src: path.join(TEST_TEMP_DIR, 'creds.tpl'),
    			dest: path.join(TEST_TEMP_DIR, 'creds-templated.json')
    		})

			fileTemplater.setConfig({
				data: templateData,
				basePath: process.cwd(),
				files: fileList,
				onCompleted: done
			})

			fileTemplater.run();
    	})

        it('should correctly create the templated file', function() {
        	var templatedFilePath = path.join(TEST_TEMP_DIR, 'creds-templated.json');

        	templatedFilePath.should.be.a.file();
        })

        it('should be correctly template the contents with provided data', function() {
        	var templatedFilePath = path.join(TEST_TEMP_DIR, 'creds-templated.json');
        	var templateFileContents = fs.readFileSync(templatedFilePath, 'utf8');
        	var templateFileJson = JSON.parse(templateFileContents);

        	templateFileJson.answer.should.equal(templateData.answer)
        })

    })
})
