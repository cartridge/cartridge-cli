var os = require('os');
var fs = require('fs-extra');
var path = require('path');
var proxyquire = require('proxyquire');
var chai = require('chai');

var DotNetAnswersFixture = require('./fixtures/DotNetNoDescription');
var newCommand = proxyquire('../../bin/commands/new', {
    inquirer: {
        prompt: function(questions, callback) {
            return callback(DotNetAnswersFixture)
        }
    }
});

var appDir = path.join(__dirname, '..', '..', 'app');
var newCommandInstance = newCommand(appDir);

var date = new Date();
var timestamp = [date.getDate(), date.getDay(), date.getFullYear(), date.getHours(), date.getMinutes(), date.getMilliseconds()].join('');

var TEST_TEMP_DIR = path.join(os.tmpdir(), 'slate-' + timestamp);

chai.use(require('chai-fs'));
chai.should();

describe('As a user of the CLI', function() {

    before(function(done) {
        this.timeout(3000);

        fs.ensureDirSync(TEST_TEMP_DIR);
        process.chdir(TEST_TEMP_DIR);
        newCommandInstance.init();

        setTimeout(done, 2000);
    })

    after(function(done) {
        fs.removeSync(TEST_TEMP_DIR);
        done();
    })

    describe('When the new command is used for the project type: Dot NET', function() {

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