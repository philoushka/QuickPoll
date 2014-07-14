//approaching looking like an email addr
exports.isDecentlyFormedEmailAddress = function(input) {
  return ((input) && (input.indexOf("@") > 1) && (input.indexOf(".") > 4));
}

//is a number ignoring the potential + country code prefix.
exports.isDecentlyFormedSmsNumber = function(input) {
  if (input) {
    console.log("cleaning " + input + " to " + input.replace(/\D/g, '') + " and checking for is numeric");
    input = input.replace(/\D/g, '');    
    return (isNumeric(input));
  }
  return false;
}

function isNumeric(num) {
    return !isNaN(num)
}

exports.cleanNotification=function(input) {
  if (!input) {
    return "";
  }
  if (exports.isDecentlyFormedSmsNumber(input)) {
    return input.replace(/\D/g, '');
  }
  else {
    return input.trim();
  }
}

