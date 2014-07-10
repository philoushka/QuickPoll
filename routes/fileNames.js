 var crypto = require('crypto');
 
exports.MakeFileName = function(id) {
    return "tally-" + id + ".json";
}

exports.GetIDFromFileName = function(fileName) {
    var a = [".json", "tally-", ".txt"];
    a.forEach(function(token) {
        fileName = fileName.replace(token, '');
    });
    return fileName;
}

exports.CreateNewID = function() {
    
    var len = 6;
    return crypto.randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len);   // return required number of characters
}