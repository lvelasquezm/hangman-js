const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const codeKey = "QBQz6FD0QVjRGEs4FER4Pyuj7myV0t38lqfllH3AGGI="

// Takes an object, and encrypts it into a string
exports.encrypt = function(obj) {
  var data = JSON.stringify(obj);
  var iv = crypto.randomBytes(16);
  var cipher = crypto.createCipheriv(algorithm, new Buffer(codeKey,'base64'), iv);
  var crypted = cipher.update(data, 'utf8', 'base64') + cipher.final('base64');
  return iv.toString('base64') + ':' + crypted;
};

// Given a string, decrypts it into an object
exports.decrypt = function(code) {
  var parts = code.split(':')
    , iv = Buffer(parts[0],'base64')
    , encrypted = parts[1]
  ;
  var decipher = crypto.createDecipheriv(algorithm, new Buffer(codeKey,'base64'),iv);
  var decrypted = decipher.update(encrypted, 'base64', 'utf8') + decipher.final('utf8');
  return JSON.parse(decrypted);v.toString('base64') + ':' + crypted;
};
