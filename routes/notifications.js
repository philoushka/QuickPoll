var validation = require("./validation.js");
var twilio = require('twilio')(process.env.TwilioAcctSid, process.env.TwilioToken);
var sendGrid = require("sendgrid")(process.env.SendGridAcct, process.env.SendGridPwd);

exports.sendSms = function(sendToPhoneNumber, message) {

  if (!sendToPhoneNumber) {
    return;
  }

  sendToPhoneNumber = exports.tryPrefixNorthAmericaCountryCode(sendToPhoneNumber);

  if (sendToPhoneNumber[0] !== "+") {
    sendToPhoneNumber = "+" + sendToPhoneNumber;
  }

  if (!message) {
    message = "test from tallyup";
  }

  twilio.messages.create({
    body: message,
    to: sendToPhoneNumber,
    from: process.env.TwilioFromNumber
  }, function(err, message) {
      if (err)
      { console.log("Problem sending Sms via Twilio: " + err.message); }
    });
}

exports.sendEmail = function(addrTo, subject, htmlBody) {
  var mail = {
    to: addrTo,
    from: "TallyUp@tallyup.net",
    subject: subject,
    html: htmlBody
  };

  sendGrid.send(mail, function(err, json) {
    if (err) { console.error("Problem sending via SendGrid: " + err); }
  });
}

exports.tryPrefixNorthAmericaCountryCode = function(input) {
  if (input.length == 10) {
    return input = "+1" + input;
  }
  return input;
}

exports.sendUserNotification = function(tally) {

  if (validation.isDecentlyFormedEmailAddress(tally.sendNotificationTo)) {
    var htmlBody = "Your tally has been created. We'll send you notifications as you've requested when a new answer is submitted.<BR><BR>";
    htmlBody += "http://tallyup.azurewebsites.net/tally/answer/" + tally.id + "<BR><BR>";
    htmlBody += "You can unsubscribe here: <BR>"
              htmlBody += "http://tallyup.azurewebsites.net/unsub/" + tally.id;

    exports.sendEmail(tally.sendNotificationTo, "New Tally Created: " + tally.question, htmlBody);
  }
  else if (validation.isDecentlyFormedSmsNumber(tally.sendNotificationTo)) {
    exports.sendSms(tally.sendNotificationTo, "A new tally has been created.\nhttp://tallyup.azurewebsites.net/tally/answer/" + tally.id + "\n" + tally.question);
  }
}
exports.sendAdminNotification = function(tally) {
  
   var sendTo = process.env.AdminNotification;
   if (validation.isDecentlyFormedEmailAddress(sendTo)) {
    var htmlBody = "A new tally has been created.<BR><BR>";
    htmlBody += "<h3>" + tally.question + "</h3><BR>" 
    htmlBody += "<p>" + tally.desc + "</p>"
    htmlBody += "http://tallyup.azurewebsites.net/tally/answer/" + tally.id;

    exports.sendEmail(sendTo, "New Tally Created: " + tally.question, htmlBody);
  }
  else if (validation.isDecentlyFormedSmsNumber(sendTo)) {
    exports.sendSms(sendTo, "Heads up! A new tally has been created.\n" + tally.question+"\nhttp://tallyup.azurewebsites.net/tally/answer/" + tally.id);
  }
  
  
 }
      