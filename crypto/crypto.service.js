var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'nnmartini';

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

module.exports = {
  encryptText : function(text) {
    return encrypt(text);
  },
  decryptText : function(text) {
    return decrypt(text);
  }
}

// var hw = encrypt("hello world")
// // outputs hello world
// console.log(decrypt(hw));
