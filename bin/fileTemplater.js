var fs = require('fs');
var path = require('path');
var extend = require('extend');
var template = require('lodash/template');

var errorHandler = require('./errorHandler');

// TWO PUBLIC METHODS
// - .setConfig()
//    - sets the template data
//    - base path
//    - files to template
//    - on each file (this will have to be done here, due to promises)
//    - on completed will be the .then() of the promise, not needed!!!
//
//  - .run()
//    - this sets the templating in motion, using the provided config\
//
//  WONDER IF THE .setConfig() can be integrated into the run() call
//  e.g.
//
//  .run(configOptions)
//  .then(function() {
//     console.log('finished templating')
//  })
//
//  have to new up an instance? etc
//  var Templater = require('templater');
//  var templater = Templater.create();
//
//  templater
//    .run(options)
//    .then(function() {
//    })

function fileTemplater() {

  var config = {};
  var defaultConfig = {
    data: {},
    basePath: process.cwd(),
    files: [],
    onEachFile: function() {}
  }

  function run(userConfig) {
    var filesToRead = [];
    config = extend(defaultConfig, userConfig);

    for (var i = 0; i < config.files.length; i++) {
      filesToRead.push(readFile(config.files[i]));
    }

    return Promise.all(filesToRead)
      .then(writeToAllFiles)
  }

  function writeToAllFiles(filesData) {
    var templatedFiles = [];

    for (var i = 0; i < filesData.length; i++) {
      templatedFiles.push(writeToFile(filesData[i]));
    }

    return Promise.all(templatedFiles);
  }

  function writeToFile(fileConfig) {
    return new Promise(function(resolve, reject) {

      fs.writeFile(fileConfig.config.dest, fileConfig.output, 'utf8', function writeFileCallback(err) {
          if (err) reject(err);

          config.onEachFile(fileConfig.config.dest);

          if(fileConfig.config.deleteSrcFile) {
            fs.unlinkSync(fileConfig.config.src);
          }

          resolve();
      });
    });
  }

  function readFile(templateFileConfig) {
    return new Promise(function(resolve, reject) {
      var compiled;
      var output;

      fs.readFile(templateFileConfig.src, 'utf8', function readFileCallback(err, fileContents) {
          if (err) reject(err);

          compiled = template(fileContents);
          output = compiled(config.data);

          resolve({
            config: templateFileConfig,
            output: output
          });
      });
    })
  }

  return {
    run: run
  }
}

module.exports = fileTemplater;
