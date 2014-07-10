var azure = require('./tallyAzure.js');
var fileNames = require('./fileNames.js');
var querystring = require("querystring");
module.exports = function(app) {

    //*************** NEW 
    app.post('/tally/new', function(req, res) {
        var tally = {
            id: fileNames.CreateNewID(),
            desc: req.body.pollDesc,
            ownerName: req.body.pollOwnerName,
            question: req.body.pollQuestion,
            numFreeTextAnswersAllowed: req.body.numFreeTextChoices
        };

        azure.SaveTally(tally, function(tallyId) {
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
        var userResponse={
            responses:req.body.pollAnswer,
            resonderName:req.body.responderName            
        };
        userResponse.responses.shift(); //the first will be null because of 1-based numbering
        
        var tallyId = req.params["tallyId"];
        azure.AppendAnswerToTally(tallyId, userResponse, function(){
            
        res.redirect("tally/results/" + tallyId);    
        });
        
    });

    //*************** RESULTS 
    app.get('/tally/results/:tallyId', function(req, res) {
        azure.GetTally(req.params["tallyId"], function(tally) {
            if(tally)
                res.render('tally/results', {tally:tally});
            else
                res.render('tally/404');
        });
    });

    //*************** ALL 
    app.get('/tally/all', function(req, res) {
        //azure.GetAllTallies(function(tallies) {
        var listTallies = [
            {
            id : "edk8437823" ,
            question : "Wait a minute - you've been declared dead. You can't give orders around here. Captain, why are we out here chasing comets? And blowing into maximum warp speed, you appeared for an instant to be in two places at once.?",
            ownerName : "philoushka",
            ownerNameEncoded: encodeURIComponent("philoushka"),
            desc : "level readymade. Post-ironic typewriter whatever, readymade literally Intelligentsia DIY Blue Bottle 8-bit seitan wolf bicycle rights. Wes Anderson Banksy Intelligentsia",
            numFreeTextAnswersAllowed : 23,
            numResponses : 2},
            {
            id : "32s847823" ,
            question : "Nullam feugiat, turpis at pulvinar vulputate, erat libero tristique tellus?",
            ownerName : "VHS XOXO Tonx",
            ownerNameEncoded: encodeURIComponent("VHS XOXO Tonx"),
            desc : "Wait a minute - you've been declared dead. You can't give orders around here. Captain, why are we out here chasing comets? And blowing into maximum warp speed, you appeared for an instant to be in two places at once. and attack the Romulans. You did exactly what you had to doYou considered all your options, you tried every alternative and then you made the hard choice.",
            numFreeTextAnswersAllowed : 2,
            numResponses : 0},
            {
            id : "d23847823" ,
            question : "Nullam feugiat, turpis at pulvinar vulputate, erat libero tristique tellus?",
            ownerName : "Echo Park",
            ownerNameEncoded: encodeURIComponent("Echo Park"),
            desc : "Wait a minute - you've been declared dead. You can't give orders around here. Captain, why are we out here chasing comets? And blowing into maximum warp speed, you appeared for an instant to be in two places at once.",
            numFreeTextAnswersAllowed : 3,
            numResponses : 5},
            {
            id : "1284783223" ,
            question : "Pitchfork cornhole next level stumptown?",
            ownerName : "meggings",
            ownerNameEncoded: encodeURIComponent("meggings"),
            desc : "Wolf salvia Vice, ennui Truffaut flexitarian chambray",
            numFreeTextAnswersAllowed : 2,
            numResponses : 7},
            
        ];
            res.render('tally/all', {tallies:listTallies});
        //});
    });
}
