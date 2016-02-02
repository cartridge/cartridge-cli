"use strict";

var titleize = require('titleize');

module.exports = function() {

    return {
        getNewCommandPromptOptions: getNewCommandPromptOptions
    }

}

function getNewCommandPromptOptions() {
    return [{
        type: "list",
        name: "projectType",
        message: "What is the project type?",
        choices: [
          "Dot NET",
          "Static Website"
        ]
    },{
        type: "input",
        name: "projectName",
        message: "What is the project name?",
        validate: function(value) { return inputNotEmpty(value, "Project Name"); },
    },{
        type: "input",
        name: "projectAuthor",
        message: "Who is the author of the project?",
        validate: function(value) { return inputNotEmpty(value, "Author"); },
        filter: function(value) { return titleize(value); }
    }, {
        type: "input",
        name: "projectDescription",
        message: "What is the project description?",
        default: function () { return ""; }
    },{
        type: "confirm",
        name: "isOkToCopyFiles",
        message: "Read to start setup! Press enter to confirm",
        default: true 
    }]
}

function inputNotEmpty(value, fieldName) {
    var isValid = (value !== "");

    return (isValid) ? true : fieldName + " cannot be empty" ;
}