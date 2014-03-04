var redis = require('redis');
var client = redis.createClient();

process.argv.slice(2).forEach(function (authorChannel, i) {
	client.subscribe(authorChannel, function() {
		console.log(authorChannel + 'チャネルを購読します。');
	});
});

client.on('message', function (channel, msg){
	console.log('%s: %s', channel, msg);
});
