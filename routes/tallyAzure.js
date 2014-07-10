var azure = require('azure-storage');
var fileNames = require('./fileNames.js');

function GetAzureBlobService() {
    return azure.createBlobService();
}

exports.GetTally = function(id, callback) {
    var blobSvc = GetAzureBlobService();
    blobSvc.getBlobToText('tally', fileNames.MakeFileName(id), function(downloadErr, blobTextResponse) {
        callback(JSON.parse(blobTextResponse));
    });
}

exports.SaveTally = function(tally, callback) {
    var blobSvc = GetAzureBlobService();
    blobSvc.createContainerIfNotExists('tally', function(error, result, response) {
        if (!error) {
            var tallyJson = JSON.stringify(tally);
            blobSvc.createBlockBlobFromText('tally', fileNames.MakeFileName(tally.id), tallyJson, function(error, result, response) {
                if (error) {
                    console.log("*Error saving tally " + error.toString());
                }
                else {
                    callback(tally.id);
                }
            });
        }
    });
}

exports.AppendAnswerToTally=function (tallyId, userResponse, callback)
{
    var blobSvc = GetAzureBlobService();
    //get tally by id
    
    //attach this user response.
    
    //save it back to Azure
    callback();
}

exports.ExtractBlobListToTallies = function(allBlobs, callback) {
    var tallies = [];

    allBlobs.forEach(function(entry) {
        var tallyId = azure.GetIDFromFileName(entry.name);
        azure.GetTally(tallyId, function(tally) {
            tallies.push(tally);
        });
    });
    callback(tallies);
}

exports.GetAllTallies = function(callback) {

    var blobSvc = azure.GetAzureBlobService();
    blobSvc.listBlobsSegmented('tally', null, function(error, result, response) {
        callback(result.entries);
    });
}
