var os = require('os');
var fs = require('fs-extra');
var path = require('path');
var proxyquire = require('proxyquire');
var chai = require('chai');

var DotNetAnswersFixture = require('./fixtures/DotNetNoDescription');
var newCommandDotNet = proxyquire('../../bin/commands/new', {
    inquirer: {
        prompt: function(questions, callback) {
            return callback(DotNetAnswersFixture)
        }
    }
});

var appDir = path.join(__dirname, '..', '..', 'app');
var newCommandDotNetInstance = newCommandDotNet(appDir);

var date = new Date();
var timestamp = [date.getDate(), date.getDay(), date.getFullYear(), date.getHours(), date.getMinutes(), date.getMilliseconds()].join('');

var TEST_TEMP_DIR = path.join(os.tmpdir(), 'slate-' + timestamp);

chai.use(require('chai-fs'));
chai.should();

function changeToOsTempDir() {
    fs.ensureDirSync(TEST_TEMP_DIR);
    process.chdir(TEST_TEMP_DIR);
}

function newCommandDotNetSetup(done) {
    this.timeout(5000);

    changeToOsTempDir();
    newCommandDotNetInstance.init({
        silent: true
    });

    setTimeout(done, 2000);
}

function newCommandTearDown(done) {
    fs.removeSync(TEST_TEMP_DIR);
    done();
}

describe.skip('As a user of the CLI', function() {

    describe('When the new command is used', function() {
        before(newCommandDotNetSetup);
        after(newCommandTearDown);

        it('should template the `creds.json` file with the correct contents', function() {
            var filePath = path.join(TEST_TEMP_DIR, '_config', 'creds.json');
            var actual = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            var expected = {
                "Site": "test project",
                "Author": "test author",
                "packageName": "test-project"
            }

            filePath.should.be.a.file().with.json;

            actual.Site.should.equal(expected.Site);
            actual.Author.should.equal(expected.Author);
            actual.packageName.should.equal(expected.packageName);
        })

        it('should template the `.slaterc` file with the correct contents', function() {
            var filePath = path.join(TEST_TEMP_DIR, '.slaterc');
            var packageJsonPath = path.join(TEST_TEMP_DIR, 'package.json');
            var packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            var actual = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            var expected = {
                "slateVersion": packageJson.version,
                "dateGenerated": [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/')
            }

            filePath.should.be.a.file().with.json;

            actual.slateVersion.should.equal(expected.slateVersion);
            actual.dateGenerated.should.equal(expected.dateGenerated);
        })

        it('should template the `package.json` file with the correct contents', function() {
            var filePath = path.join(TEST_TEMP_DIR, 'package.json');
            var actual = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            var expected = {
                "name": "test-project",
                "description": ""
            }

            filePath.should.be.a.file().with.json;

            actual.name.should.equal(expected.name);
            actual.description.should.equal(expected.description);
        })
    })

    describe('When the new command is used for the project type: Dot NET', function() {
        before(newCommandDotNetSetup);
        after(newCommandTearDown);

        it('should populate the directory', function() {
            TEST_TEMP_DIR.should.be.a.directory().and.not.empty;
        })

        it('should not include the `views` directory', function() {
            var pathToTest = path.join(TEST_TEMP_DIR, 'views');

            pathToTest.should.not.be.a.path();
        })

        it('should not include the `release.js` gulp partial', function() {
            var pathToTest = path.join(TEST_TEMP_DIR, 'gulpTasks', 'release.js');

            pathToTest.should.not.be.a.path();
        })

    })
})
