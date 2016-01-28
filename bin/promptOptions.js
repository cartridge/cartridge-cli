var titleize = require('titleize');

var _newOptions 

module.exports = function() {

    return {
        newOptions: _newOptions
    }

}

_newOptions = [{
    type: "input",
    name: "projectAuthor",
    message: "Who is the author of the project?",
    validate: authorValidate,
    filter: function(value) { return titleize(value); }
}, {
    type: "input",
    name: "projectDescription",
    message: "What is the project description?",
    default: function () { return ""; }
},{
    type: "confirm",
    name: "isOkToCopyFiles",
    message: "Copying over files to current directory. Press enter to confirm",
    default: true 
}]

function authorValidate(value) {
    var isValid = (value !== "");

    if(isValid) {
        return true;
    } else {
        return "Author cannot be empty"
    }
}