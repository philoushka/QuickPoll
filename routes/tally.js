var azure = require('./tallyAzure.js');
var fileNames = require('./fileNames.js');
var crypto = require('./crypto.js');
var querystring = require("querystring");
var notif = require("./notifications.js");
var validation = require("./validation.js");
var moment = require("moment");

//sort the objects by their id properties.
function compare(a, b) {
  if (a.createdDateTimeMilliseconds > b.createdDateTimeMilliseconds)
    return -1;
  if (a.createdDateTimeMilliseconds < b.createdDateTimeMilliseconds)
    return 1;
  return 0;
}

function setUpTalliesForDisplay(tallies, callback) {

  tallies = tallies.sort(compare);
  tallies.forEach(function(tally) {
    ensureDateApplied(tally);
  });
  callback(tallies);
}

function ensureDateApplied(tally) {
  tally.createdDateString = "";
  if (tally.createdDateTimeMilliseconds) {
    tally.createdDateString = moment(tally.createdDateTimeMilliseconds).calendar();
  }
}

module.exports = function(app) {

  //*************** NEW 
  app.post('/tally/new', function(req, res) {
    var tally = {
      id: crypto.createNewID(),
      desc: req.body.pollDesc,
      createdDateTimeMilliseconds: Date.now(),
      sendNotificationTo: validation.cleanNotification(req.body.notification),
      deleteToken: crypto.createNewID(20),
      ownerName: req.body.pollOwnerName,
      question: req.body.pollQuestion,
      numFreeTextAnswersAllowed: req.body.numFreeTextChoices
    };

    azure.saveTally(tally, function(tallyId) {
      notif.sendUserNotification(tally);
      notif.sendAdminNotification(tally);
      res.redirect("/tally/answer/" + tallyId);
    });
  });

  app.get('/tally/new', function(req, res) {
    res.render('tally/new', { title: "Make A New Tally" });
  });

  //*************** ANSWER 
  app.get('/tally/answer/:tallyId', function(req, res) {
    azure.getTally(req.params["tallyId"], function(tally) {
      ensureDateApplied(tally);
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
    azure.appendAnswerToTally(tallyId, userResponse, function() {
      res.redirect("tally/results/" + tallyId);
    });
  });

  //*************** RESULTS 
  app.get('/tally/results/:tallyId', function(req, res) {
    azure.getTally(req.params["tallyId"], function(tally) {
      if (tally)
        res.render('tally/results', { tally: tally });
      else
        res.render('tally/404');
    });
  });

  //*************** ALL
  app.get('/tally/all', function(req, res) {
    azure.getAllTallies(function(allTallies) {
      // res.send(JSON.stringify(allTallies));     
      console.log("got " , allTallies.length);
      setUpTalliesForDisplay(allTallies, function(tallies) {
        res.render('tally/all', { tallies: allTallies });
      });
    });
  });

  //*************** DELETE 
  app.delete('/tally/delete/:tallyId/:deleteToken', function(req, res) {
    var tallyId = req.params["tallyId"];
    var delToken = req.params["deleteToken"];

    azure.getTally(tallyId, function(tally) {
      if (tally.deleteToken === delToken) {
        azure.deleteTally(tallyId, function() {          
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end(JSON.stringify({ "deleteSuccess": true }));
        });
      }
    
    });

  });
}
     