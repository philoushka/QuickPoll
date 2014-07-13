 
//append a prefix and suffix to the tally id  
exports.makeFileName = function(id) {
    return "tally-" + id + ".json";
}

//strip the prefix and suffix from the file name, resulting in the tally id
exports.getIDFromFileName = function(fileName) {
    var a = [".json", "tally-", ".txt"];
    a.forEach(function(token) {
        fileName = fileName.replace(token, '');
    });
    return fileName;
}