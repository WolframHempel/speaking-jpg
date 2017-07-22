const fs = require( 'fs' );
const opts = require( './options.js' );
const crypto = require('crypto');
const START_MARKER = Buffer.from([ 32, 154, 66, 56, 174, 23, 77 ]);
const COMMENT_BYTES = Buffer.from([ 0xFF, 0xFE ]);
const ALGORITHM = 'aes-256-ctr';
const imgData = fs.readFileSync( opts.in );

if( opts.action === 'create' ) {
	if( retrieveMessage() !== null ) throw new Error( 'Image already contains a message' );
	const message = createMessage();
	const manipulatedImgData = Buffer.concat([ imgData.slice( 0, 2 ), message, imgData.slice( 2 ) ]);
	fs.writeFileSync( opts.out, manipulatedImgData );
	console.log( 'Done! Hidden message in ' + opts.out );
} else {
	const encryptedMessage = retrieveMessage();
	if( encryptedMessage === null ) throw new Error( 'No message found in ' + opts.in );
	console.log( 'Message: ' + decrypt( encryptedMessage, opts.key ).toString( 'utf8' ) );
}

function createMessage() {
	const encryptedMessage = encrypt( Buffer.from( opts.msg, 'utf8' ), opts.key );
	const length = Buffer.from( getInt64Bytes( 2 + START_MARKER.byteLength + encryptedMessage.byteLength ) );
	return Buffer.concat([ COMMENT_BYTES, length, START_MARKER, encryptedMessage]);
}

function retrieveMessage() {
	const startIndex = imgData.indexOf( START_MARKER );
	if( startIndex === -1 ) return null;
	const msgLength = intFromBytes([ imgData[ startIndex - 2 ], imgData[ startIndex - 1 ] ]);
	return imgData.slice( startIndex + START_MARKER.byteLength, msgLength + 4 );
}

function encrypt(buffer, password){
	var cipher = crypto.createCipher(ALGORITHM,password)
	return Buffer.concat([cipher.update(buffer),cipher.final()]);
};

function decrypt(buffer, password){
	var decipher = crypto.createDecipher(ALGORITHM,password)
	return Buffer.concat([decipher.update(buffer) , decipher.final()]);
};

function intFromBytes( x ){
    var val = 0;
    for (var i = 0; i < x.length; ++i) {
        val += x[i];
        if (i < x.length-1) {
            val = val << 8;
        }
    }
    return val;
}

function getInt64Bytes( x ){
    var bytes = [];
    var i = 2;
    do {
    bytes[--i] = x & (255);
    x = x>>8;
    } while ( i )
    return bytes;
}