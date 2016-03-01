var request = require('request');

request('http://twitter.github.com/bootstrap/assets/bootstrap.zip')
  .pipe(fs.createWriteStream('bootstrap.zip'))
  .on('close', function () {
    console.log('File written!');
  });