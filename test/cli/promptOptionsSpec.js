var chai = require('chai');
var expect = chai.expect;

var promptOptionsModule = require('../../bin/promptOptions');

chai.should();

describe('As a user of the promptOptions module', function() {

    it('should return an object', function() {
        var test = promptOptionsModule;

        expect(test).to.be.a('object');
    })

    describe('When using getNewCommandPromptOptions()', function() {

        it('should be a function', function() {
            var test = promptOptionsModule.getNewCommandPromptOptions;

            expect(test).to.be.a('function');
        })

        it('should return an array', function(done) {
            promptOptionsModule
                .getNewCommandPromptOptions()
                .then(function(promptOptions) {
                    expect(promptOptions instanceof Array).to.be.true;
                    done();
                })
        })

        it('should return an array that is not empty', function(done) {
            promptOptionsModule
                .getNewCommandPromptOptions()
                .then(function(promptOptions) {
                    expect(promptOptions.length).to.be.above(1);
                    done();
                })
        })

    })

})
