var fs = require('fs');
var chai = require('chai');
var route = require('../../routes/main.js');

describe('Styleguide automated content', function() {

    chai.should();

    describe('When I request a file from disk', function() {

        it('should return a single file', function(done) {
            var file = fs.readFile(__dirname + '/../../_source/styles/_settings/_settings.colors.scss', 'utf8', function (err,data) {
              data.should.not.be.empty;
              done();
            });
            
        });

    });

});