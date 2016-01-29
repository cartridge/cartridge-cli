"use strict"

var chalk = require('chalk');

var errorTheme = chalk.bold.red;
var WarningTheme = chalk.bold.yellow;
var infoTheme = chalk.bold.blue;
var successTheme = chalk.bold.green;
var underlineTheme = chalk.bold.underline;

module.exports = function() {
    return {
        log: log,

    };

    function log(type, message) {
        var prefix = '=> ';

        switch(type){
            case 'info':
                console.log(infoTheme(prefix + message));
                break;
            case 'success':
                console.log(successTheme(prefix + message));
                break;
            case 'error':
                console.log(errorTheme(prefix + message));
                break;
            case 'warning':
                console.log(WarningTheme(prefix + message));
                break;
            case 'underline':
                console.log(underlineTheme(prefix + message));
                break;
            default:
                console.log(prefix + chalk.underline(message));
                break;
        }

    }

}