var mysql = require('mysql');
var client = mysql.createClient({
	user: 'root',
	password: 'wada1443'
});

client.query('CREATE DATABASE quotes');
client.useDatabase('quotes');

client.query('CREATE TABLE quotes.quotes (' +
	'id INT NOT NULL AUTO_INCREMENT, ' +
	'author VARCHAR(128) NOT NULL, ' +
	'quote TEXT NOT NULL, PRIMARY KEY(id)' +
	')'
);
