var azure = require('azure-storage');
var fileNames = require('./fileNames.js');

function getAzureBlobService() {
    return azure.createBlobService();
}

exports.getTally = function(id, callback) {
    var blobSvc = getAzureBlobService();
    blobSvc.getBlobToText('tally', fileNames.makeFileName(id), function(downloadErr, blobTextResponse) {
        callback(JSON.parse(blobTextResponse));
    });
}

exports.deleteTally = function(id, callback) {
    var blobSvc = getAzureBlobService();
    blobSvc.deleteBlob('tally', fileNames.makeFileName(id), function(deleteErr, response) {        
        callback();
    });
}

exports.saveTally = function(tally, callback) {
    var blobSvc = getAzureBlobService();
    blobSvc.createContainerIfNotExists('tally', function(error, result, response) {
        if (!error) {
            var tallyJson = JSON.stringify(tally);
            blobSvc.createBlockBlobFromText('tally', fileNames.makeFileName(tally.id), tallyJson, function(error, result, response) {
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

exports.appendAnswerToTally = function(tallyId, userResponse, callback) {
    var blobSvc = getAzureBlobService();
    //get tally by id

    //attach this user response.

    //save it back to Azure
    callback();
}

 exports.getAllTallies = function(next) {
    var blobSvc = getAzureBlobService();
    blobSvc.listBlobsSegmented('tally', null, function(error, result, response) {
        var tallyCount = result.entries.length;
        console.log("got tally count ", tallyCount);
        var tallies = [];
        result.entries.forEach(function(tallyListEntry) {
          
            var tallyId = fileNames.getIDFromFileName(tallyListEntry.name);
            exports.getTally(tallyId, function(tally) {
                
                if(tally)
                {
                    tally.numResponses =0;
                    if(tally.responses)
                    {
                        tally.numResponses = tally.responses.length;
                    }
              
                    tallies.push(tally);
                }
                else
                {console.log("couldn't get ", tallyId);}
                tallyCount--;
                if (tallyCount <= 0) {
                    next(tallies);
                }
            });
        });
    });
}

