exports = { decrypt, encrypt };


var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'a6F3Efeqzza';



const fs = require('fs');

function encrypt(text, context, id){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  var path = require('path');
  require('fs').writeFileSync('cpdcontent/' + id + '_' + context + '.dat', crypted, {encoding:'hex'});
  return crypted;
}


function decrypt(context, id){
  var content = fs.readFileSync('cpdcontent/' + id + '_' + context + '.dat', {encoding:'hex'});
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(content,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
