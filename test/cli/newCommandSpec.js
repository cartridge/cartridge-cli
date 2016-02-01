var os = require('os');
var fs = require('fs-extra');
var path = require('path');
var chai = require('chai');

chai.use(require('chai-fs'));
chai.should();

var proxyquire = require('proxyquire');
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

var TEMP_DIR = path.join(os.tmpdir(), 'slate-test-' + timestamp);

describe('As a user of the CLI', function() {

    before(function(done) {
        this.timeout(3000);

        fs.ensureDirSync(TEMP_DIR);
        process.chdir(TEMP_DIR);
        newCommandInstance.init();

        setTimeout(done, 2000);
    })

    after(function(done) {
        fs.removeSync(TEMP_DIR);
        done();
    })

    describe('When the new command is used', function() {

        it('should populate the location', function() {
            TEMP_DIR.should.be.a.directory().and.not.empty;
        })

    })

})