var chai = require('chai');
var expect = chai.expect;

var promptOptionsModule = require('../../bin/promptOptions')();

chai.should();

describe.skip('As a user of the promptOptions module', function() {

    it('should return an object', function() {
        var test = promptOptionsModule;

        expect(test).to.be.a('object');
    })

    describe('When using getNewCommandPromptOptions()', function() {

        it('should be a function', function() {
            var test = promptOptionsModule.getNewCommandPromptOptions;

            expect(test).to.be.a('function');
        })

        it('should return an array', function() {
            var test = promptOptionsModule.getNewCommandPromptOptions();

            expect(test instanceof Array).to.be.true;
        })

        it('should return an array that is not empty', function() {
            var actual = promptOptionsModule.getNewCommandPromptOptions();

            expect(actual.length).to.be.above(1);
        })

    })

})
