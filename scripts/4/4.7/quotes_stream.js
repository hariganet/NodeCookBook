var cradle = require('cradle');
var db = new(cradle.Connection)({
	auth: { username: 'node', password: 'cookbook' }
}).database('quotes');

db.changes().on('response', function (response) {
	response.on('data', function (change) {
		var changeIsObj = {}.toString.call(change) === '[object Object]';
		if (change.deleted || !changeIsObj) { return; }
		db.get(change.id, function (err, doc) {
			if (!doc) { return; }
			if (doc.author && doc.quote) {
				console.log('%s: %s', doc.author, doc.quote);
			}
		});
	});
});