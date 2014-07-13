var azure = require('./tallyAzure.js');
var fileNames = require('./fileNames.js');
var crypto = require('./crypto.js');
var querystring = require("querystring");
var notif = require("./notifications.js");
var validation = require("./validation.js");

//sort the objects by their id properties.
//todo change this to thei createdDateTimeMilliseconds
function compare(a, b) {
    if (a.id < b.id)
        return -1;
    if (a.id > b.id)
        return 1;
    return 0;
}




function SetUpTalliesForDisplay(tallies, callback) {

    tallies = tallies.sort(compare);
    tallies.forEach(function(tally) {
        if(tally.createdDateTimeMilliseconds && tally.createdDateString==undefined)
        {
        tally.createdDateString = new Date(tally.createdDateTimeMilliseconds).toLocaleDateString();
        }
    });
    callback(tallies);
}

module.exports = function(app) {

    //*************** NEW 
    app.post('/tally/new', function(req, res) {
        var tally = {
            id: crypto.CreateNewID(),
            desc: req.body.pollDesc,
            createdDateTimeMilliseconds: Date.now(),
            createdDateString: new Date().toLocaleDateString(),
            sendNotificationTo:req.body.notification,            
            deleteToken: crypto.CreateNewID(20),
            ownerName: req.body.pollOwnerName,
            question: req.body.pollQuestion,            
            numFreeTextAnswersAllowed: req.body.numFreeTextChoices
        };

        azure.SaveTally(tally, function(tallyId) {
            
            if(validation.isDecentlyFormedEmailAddress(tally.sendNotificationTo))
            {
              var htmlBody = "Your tally has been created. We'll send you notifications as you've requested when a new answer is submitted.<BR><BR>";
              htmlBody += "http://tallyup.azurewebsites.net/tally/answer/"+tally.id + "<BR><BR>";
              htmlBody += "You can unsubscribe here: <BR>"
              htmlBody += "http://tallyup.azurewebsites.net/unsub/"+tally.ownerName;
              
              notif.sendEmail(tally.sendNotificationTo, "New Tally Created: " + tally.question, htmlBody );
            }
            else if(validation.isDecentlyFormedSmsNumber(tally.sendNotificationTo))
            {
              notif.sendSms(tally.sendNotificationTo,"A new tally has been created.\nhttp://tallyup.azurewebsites.net/tally/answer/"+tally.id+"\n" + tally.question);
            }
            res.redirect("/tally/answer/" + tallyId);
        });
    });

    app.get('/tally/new', function(req, res) {
        res.render('tally/new', { title: "Make A New Tally" });
    });

    //*************** ANSWER 
    app.get('/tally/answer/:tallyId', function(req, res) {
        azure.GetTally(req.params["tallyId"], function(tally) {
            res.render('tally/answer', tally);
        });
    });

    app.post('/tally/addAnswer/:tallyId', function(req, res) {
        req.body.pollAnswer
        var userResponse = {
            responses: req.body.pollAnswer,
            resonderName: req.body.responderName
        };
        userResponse.responses.shift(); //the first will be null because of 1-based numbering

        var tallyId = req.params["tallyId"];
        azure.AppendAnswerToTally(tallyId, userResponse, function() {

            res.redirect("tally/results/" + tallyId);
        });
    });

    //*************** RESULTS 
    app.get('/tally/results/:tallyId', function(req, res) {
        azure.GetTally(req.params["tallyId"], function(tally) {
            if (tally)
                res.render('tally/results', { tally: tally });
            else
                res.render('tally/404');
        });
    });

    //*************** ALL
    app.get('/tally/all', function(req, res) {
        azure.read_azure_list(function(allTallies) {
            // res.send(JSON.stringify(allTallies));     
            SetUpTalliesForDisplay(allTallies, function(tallies) {
                res.render('tally/all', { tallies: allTallies });
            });
        });
    });

    //*************** DELETE 
    app.get('/tally/delete/:tallyId/:deleteToken', function(req, res) {
        var tallyId = req.params["tallyId"];
        var delToken = req.params["deleteToken"];
        azure.GetTally(tallyId, function(tally) {
            if (/*tally.deleteToken == undefined ||*/ tally.deleteToken === delToken) {
                azure.DeleteTally(tallyId, function() {
                    res.redirect('tally/all');
                });
            }
            else {
                res.render('tally/404');
            }
        });
    });


}
     