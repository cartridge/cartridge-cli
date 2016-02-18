var fs = require('fs');
var path = require('path');
var chai = require('chai');

describe.skip('Styleguide automated content', function() {

    chai.should();

    describe('When I request a file from disk', function() {

        it('should return a single file', function(done) {

            var fileToTest = path.resolve(__dirname, '..', '..' ,'app', '_source', 'styles', '_settings', '_settings.colors.scss')

            var file = fs.readFile(fileToTest, 'utf8', function (err,data) {
                data.should.not.be.empty;
                done();
            });

        });

    });

});
