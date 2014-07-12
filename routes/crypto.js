 var crypto = require('crypto');
 
 //creates a hex string of a given length
 exports.CreateNewID = function(len) {
    
    if(!len)
    {
        len=6;
    } 
    return crypto.randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len);   // return required number of characters
}

exports.CreateSha1= function(strings)
{
    return crypto.createHash("sha1").update(strings.join()).digest('hex');
    
}