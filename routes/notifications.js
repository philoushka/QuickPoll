
var twilio = require('twilio')('AC0d84d4dcf0c969b452091a5cf241d8d5', "85155b0ac51f49cb0b63444aab5a1790");
var sendGrid = require("sendgrid")("azure_e77131a7ea3544e075d830c04e601c45@azure.com", "zcW031zV0X9qmhh");

exports.sendSms = function(sendToPhoneNumber, message) {
  if (!sendToPhoneNumber) {
    sendToPhoneNumber = "2508639632";
  }

  sendToPhoneNumber = exports.tryPrefixNorthAmericaCountryCode(sendToPhoneNumber);
  
  if(sendToPhoneNumber[0] !== "+")
  {
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
      { console.log("Problem sending: " + err.message); }

    });
}

exports.sendEmail = function(addrTo, subject, htmlBody) {
  var mail = {
    to: addrTo,
    from: "admin@tallyup.net",
    subject: subject,
    html: htmlBody
  };

  sendGrid.send(mail, function(err, json) {
    if (err) { console.error(err); }
    console.log(json);
  });
}

exports.tryPrefixNorthAmericaCountryCode=function(input)
{
  if(input.length==10)
  {
    return input= "+1" + input;
  }
  
}