var redis = require('redis');
var client = redis.createClient();
var params = { author: process.argv[2], quote: process.argv[3] };

client.on('ready', function () {
	if (params.author && params.quote) {
		var randKey = "Quotes:" + (Math.random() * Math.random()).toString(16).replace('.', '');
		client.multi()
			.hmset(randKey, {
				"author": params.author,
				"quote": params.quote
			})
			.sadd('Author:' + params.author, randKey)
			.exec(function (err, replies) {
				if (err) { throw err; }
				if (replies[0] == 'OK') { console.log('追加されました。'); }
			});
	}
	
	if (params.author) {
		client.smembers('Author:' + params.author, function (err, keys) {
			keys.forEach(function (key) {
				client.hgetall(key, function (err, hash) {
					if (err) {console.log(err); return;}
					console.log('%s: %s', hash.author, hash.quote);
				});
			});
			client.quit();
		});
	} else {
		client.quit();
	}
});
