
var twilio = require('twilio')(process.env.TwilioAcctSid,process.env.TwilioToken);
var sendGrid = require("sendgrid")(process.env.SendGridAcct, process.env.SendGridPwd);

exports.sendSms = function(sendToPhoneNumber, message) {
  if (!sendToPhoneNumber) {
    return;
  }

  sendToPhoneNumber = exports.tryPrefixNorthAmericaCountryCode(sendToPhoneNumber);
  
  if(sendToPhoneNumber[0] !== "+"){
    sendToPhoneNumber = "+" + sendToPhoneNumber;    
  }
  
  if (!message) {
    message = "test from tallyup";
  }
  twilio.messages.create({
    body: message,
    to: sendToPhoneNumber,
    from: "+16474960447"
    //,        mediaUrl: "https://www.google.ca/logos/2014/worldcup14/closing/cta.png"
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

exports.tryPrefixNorthAmericaCountryCode=function(input)
{
  if(input.length==10)
  {
    return input= "+1" + input;
  }
  
}