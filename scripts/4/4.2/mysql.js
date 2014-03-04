var mysql = require('mysql');
var client = mysql.createClient({
	user: 'root',
	password: 'パスワード'
});

client.query('CREATE DATABASE quotes');
client.useDatabase('quotes');

client.query('CREATE TABLE quotes.quotes (' +
	'id INT NOT NULL AUTO_INCREMENT, ' +
	'author VARCHAR(128) NOT NULL, ' +
	'quote TEXT NOT NULL, PRIMARY KEY(id)' +
	')'
);

var ignore = [mysql.ERROR_DB_CREATE_EXISTS, mysql.ERROR_TABLE_EXISTS_ERROR];

client.on('error', function(err){
	if(ignore.indexOf(err.number) > -1) { return; }
	throw err;
});

client.query('INSERT INTO quotes.quotes (' +
	'author, quote) ' +
	'VALUES ("ビャーネ・ストロヴストルップ", "類推による証明は詐欺である。");'
);

client.end();
