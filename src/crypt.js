const crypto = require('crypto');
const algorithm = 'aes-256-ctr';

exports.encrypt = function (buffer, password){
	var cipher = crypto.createCipher(algorithm,password)
	return Buffer.concat([cipher.update(buffer),cipher.final()]);
};

exports.decrypt = function(buffer, password){
	var decipher = crypto.createDecipher(algorithm,password)
	return Buffer.concat([decipher.update(buffer) , decipher.final()]);
};