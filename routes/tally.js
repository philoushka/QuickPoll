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
    	azure.read_azure_list( function(allTallies){
          // res.send(JSON.stringify(allTallies));                  
          res.render('tally/all', {tallies:allTallies});                   
        });
     }); 
}    
     