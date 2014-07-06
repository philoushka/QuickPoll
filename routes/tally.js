module.exports = function(app) {

    app.post('/tally/new', function(req, res) {

        var tally = {
            id: CreateNewID(),
            desc: req.body.pollDesc,
            ownerName:req.body.pollOwnerName,
            question: req.body.pollQuestion,
            numFreeTextAnswersAllowed: req.body.numFreeTextChoices
        };

        SaveTally(tally, function(tallyId) {
            res.redirect("/tally/answer/" + tallyId);
        });
    });

    // make tally
    app.get('/tally/new', function(req, res) {
        res.render('tally/new', { title: "Make A New Tally" });
    });

    // answer a tally
    app.get('/tally/answer/:tallyId', function(req, res) {
        GetTally(req.params["tallyId"], function(tally) {
            res.render('tally/answer', tally);
        });
    });

    app.post('/tally/addAnswer/:tallyId', function(req, res) {
        res.send("thanks for taking the poll. you answered: \r\n  " + JSON.stringify(req.body));
    });

    // results view
    app.get('/tally/results/:tallyId', function(req, res) {
        GetTally(req.params["tallyId"], function(tally) {
            res.render('tally/results', tally);
        });
    });

}

function CreateNewID() {
    var crypto = require('crypto');
    var len = 6;
    return crypto.randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len);   // return required number of characters
}

function SaveTally(tally, callback) {
    var azure = require('azure-storage');
    var blobSvc = azure.createBlobService();
    blobSvc.createContainerIfNotExists('tally', function(error, result, response) {
        if (!error) {
            var tallyJson = JSON.stringify(tally);
            blobSvc.createBlockBlobFromText('tally', MakeFileName(tally.id), tallyJson, function(error, result, response) {
                if (error) {
                    console.log("*** ERR  saving tally " + error.toString());
                }
                else {
                    callback(tally.id);
                }
            });
        }
    });
}

function GetTally(id, callback) {
    var azure = require('azure-storage');
    var blobSvc = azure.createBlobService();    
    blobSvc.getBlobToText('tally', MakeFileName(id), function(downloadErr, blobTextResponse) {
        callback(JSON.parse(blobTextResponse));
    });
}

function MakeFileName(id) {
    return "tally-" + id + ".json";
}
