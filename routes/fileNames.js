 
//append a prefix and suffix to the tally id  
exports.MakeFileName = function(id) {
    return "tally-" + id + ".json";
}

//strip the prefix and suffix from the file name, resulting in the tally id
exports.GetIDFromFileName = function(fileName) {
    var a = [".json", "tally-", ".txt"];
    a.forEach(function(token) {
        fileName = fileName.replace(token, '');
    });
    return fileName;
}