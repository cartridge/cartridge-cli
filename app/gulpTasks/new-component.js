var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var viewsPath = path.join(process.cwd(), 'views')
var partialsPath = path.join(viewsPath, '_partials');

var componentPath;
var hbsFileName;
var scssFileName;

module.exports = function(gulp, config, argv, creds) {

    gulp.task('new-component', function (cb) {

        if(!argv.name) {
            noNameGivenOutput();
        } else {
            createComponentAssets();
        }

        cb();

    });

    function noNameGivenOutput() {
        console.log('');
        console.log('A component must have a name');
        console.log('');
        console.log('Example usage:')
        console.log('gulp component --name header');
        console.log('');
    }

    function createComponentAssets() {
        hbsFileName = argv.name + '.hbs';
        scssFileName = argv.name + '.scss';
        componentPath = path.join(partialsPath, argv.name);

        fs.mkdirSync(componentPath);
        console.log('');
        console.log(chalk.green('✓ Folder "%s" created'), argv.name);

        fs.writeFileSync(path.join(componentPath, hbsFileName), '<h1>' + argv.name +'</h1>', 'utf8');
        console.log(chalk.green('✓ Handlebars file "%s" created'), hbsFileName);

        fs.writeFileSync(path.join(componentPath, scssFileName), '//' + argv.name + ' styles', 'utf8');
        console.log(chalk.green('✓ Sass file "%s" created'), scssFileName);
        console.log('')
        console.log(chalk.bold('Component files created in "%s"'), componentPath);
        console.log('')
    }

}