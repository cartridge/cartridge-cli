var path = require('path');
var chai = require('chai');

chai.use(require('chai-fs'));
chai.should();

const ROOT_DIR = path.join(process.cwd(), 'app');

describe('As a dev', function() {

    describe('when testing generator file structure', function() {

        it('then _config files should exist', function() {
            var pathToTest = path.join(ROOT_DIR, '_config/');
            var filePathToTest;

            var files = [
                'creds.json',
                'handlebars.json',
                'itcss.js',
                'jshint.json',
                'paths.js',
                'project.json',
                'sass.json',
                'templateData.json',
                'templateHelpers.js',
            ];

            files.forEach(function(fileName) {
                filePathToTest = path.join(pathToTest, fileName);
                filePathToTest.should.be.a.file().and.not.empty;
            });
        })

        it('then required express files should exist', function() {
            var filePathToTest;
            var files = [
                'website.js'
            ];

            files.forEach(function(fileName) {
                filePathToTest = path.join(ROOT_DIR, fileName);
                filePathToTest.should.be.a.file().and.not.empty;
            });
        })

        it('then required build files should exist', function() {
            var filePathToTest;
            var files = [
                'gulpfile.js',
                'package.json'
            ];

            files.forEach(function(fileName) {
                filePathToTest = path.join(ROOT_DIR, fileName);
                filePathToTest.should.be.a.file().and.not.empty;
            });
        })

        it('then required handlebars view files should exist', function() {
            var pathToTest = path.join(ROOT_DIR, 'views/');
            var files = [
                'styleguide.hbs'
            ]

            files.forEach(function(fileName) {
                filePathToTest = path.join(pathToTest, fileName);
                filePathToTest.should.be.a.file().and.not.empty;
            });
        })

    });

});