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

exports.AppendAnswerToTally = function(tallyId, userResponse, callback) {
    var blobSvc = GetAzureBlobService();
    //get tally by id

    //attach this user response.

    //save it back to Azure
    callback();
}

 exports.read_azure_list = function(next) {
    var blobSvc = GetAzureBlobService();
    blobSvc.listBlobsSegmented('tally', null, function(error, result, response) {
        var tallyCount = result.entries.length;
        var tallies = [];
        result.entries.forEach(function(tallyListEntry) {
            var tallyId = fileNames.GetIDFromFileName(tallyListEntry.name);
            exports.GetTally(tallyId, function(tally) {
                if(tally)
                {
                     tally.numResponses =0;
                    if(tally.responses)
                    {
                        tally.numResponses = tally.responses.length;
                    }
              
                    tallies.push(tally);
                }
                tallyCount--;
                if (tallyCount <= 0) {
                    next(tallies);
                }
            });
        });
    });
}

