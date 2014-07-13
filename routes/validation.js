//approaching looking like an email addr
exports.isDecentlyFormedEmailAddress=function(input)
{
  return ((input) && (input.indexOf("@") > 1) && (input.indexOf(".") > 4));
}

//is a number ignoring the potential + country code prefix.
exports.isDecentlyFormedSmsNumber=function(input)
{  
    return ((input) && (isNumeric(input.replace("+",""))));
}

function isNumeric(num){
    return !isNaN(num)
}
