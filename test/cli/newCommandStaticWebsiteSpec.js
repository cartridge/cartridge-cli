var os = require('os');
var fs = require('fs-extra');
var path = require('path');
var proxyquire = require('proxyquire');
var chai = require('chai');

var StaticSiteAnswersFixture = require('./fixtures/StaticNoDescription');
var newCommandStaticSite = proxyquire('../../bin/commands/new', {
    inquirer: {
        prompt: function(questions, callback) {
            return callback(StaticSiteAnswersFixture)
        }
    }
});

var appDir = path.join(__dirname, '..', '..', 'app');
var newCommandStaticSiteInstance = newCommandStaticSite(appDir);

var date = new Date();
var timestamp = [date.getDate(), date.getDay(), date.getFullYear(), date.getHours(), date.getMinutes(), date.getMilliseconds()].join('');

var TEST_TEMP_DIR = path.join(os.tmpdir(), 'slate-' + timestamp);

chai.use(require('chai-fs'));
chai.should();

function changeToOsTempDir() {
    fs.ensureDirSync(TEST_TEMP_DIR);
    process.chdir(TEST_TEMP_DIR);
}

function newCommandStaticSiteSetup(done) {
    this.timeout(5000);

    changeToOsTempDir();
    newCommandStaticSiteInstance.init({
        silent: true
    });

    setTimeout(done, 2000);
}

function newCommandTearDown(done) {
    fs.removeSync(TEST_TEMP_DIR);
    done();
}

describe.skip('As a user of the CLI', function() {

    describe('When the new command is used for the project type: Static site', function() {
        before(newCommandStaticSiteSetup);
        after(newCommandTearDown);

        it('should populate the directory', function() {
            TEST_TEMP_DIR.should.be.a.directory().and.not.empty;
        })
    })
})
