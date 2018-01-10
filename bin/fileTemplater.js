// Enable strict mode for older versions of node
// eslint-disable-next-line strict, lines-around-directive
'use strict';

const fs = require('fs');
// const path = require('path');
const extend = require('extend');
const template = require('lodash/template');

// const errorHandler = require('./errorHandler');

function fileTemplater() {

  let config = {};
  const defaultConfig = {
    data: {},
    basePath: process.cwd(),
    files: [],
    onEachFile() {}
  };

	function writeToFile(fileConfig) {
    return new Promise((resolve, reject) => {

      fs.writeFile(fileConfig.config.dest, fileConfig.output, 'utf8', (err) => {
          if (err) reject(err);

          config.onEachFile(fileConfig.config.dest);

          if(fileConfig.config.deleteSrcFile) {
            fs.unlinkSync(fileConfig.config.src);
          }

          resolve();
      });
    });
  }

	function writeToAllFiles(filesData) {
    const templatedFiles = [];

    for (let i = 0; i < filesData.length; i++) {
      templatedFiles.push(writeToFile(filesData[i]));
    }

    return Promise.all(templatedFiles);
  }

	function readFile(templateFileConfig) {
    return new Promise((resolve, reject) => {
      let compiled;
      let output;

      fs.readFile(templateFileConfig.src, 'utf8', (err, fileContents) => {
          if (err) reject(err);

          compiled = template(fileContents);
          output = compiled(config.data);

          resolve({
            config: templateFileConfig,
            output
          });
      });
    })
  }

  function run(userConfig) {
    const filesToRead = [];
    config = extend(defaultConfig, userConfig);

    for (let i = 0; i < config.files.length; i++) {
      filesToRead.push(readFile(config.files[i]));
    }

    return Promise.all(filesToRead)
      .then(writeToAllFiles)
  }

  return {
    run
  }
}

module.exports = fileTemplater;
