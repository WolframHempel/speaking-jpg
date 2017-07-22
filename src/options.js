const argv = require('minimist')(process.argv.slice(2));

if( argv._.length !== 1 ) {
	throw new Error( 'Please specify on operation (either create or read)' )
}

if( ['create', 'read'].indexOf( argv._[ 0 ] ) === -1 ) {
	throw new Error( 'Unknown operation ' + argv._[ 0 ] + ' - please specify either create or read' );
}

if( !argv.in ) {
	throw new Error( 'Missing parameter in, please specify a source image to read from' );
}

if( !argv.key ) {
	throw new Error( 'Missing parameter key, please specify a key to encrypt the message with' );
}

argv.action = argv._[ 0 ];

if( argv.action === 'create' ) {
	if( !argv.out ) {
		throw new Error( 'Missing parameter out, please specify a file to write to' );
	}

	if( !argv.msg ) {
		throw new Error( 'Missing parameter msg, please specify a message to hide in the file' );
	}
}

module.exports = argv;