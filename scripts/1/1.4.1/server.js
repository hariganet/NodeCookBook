var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	'.js': 'text/javascript',
	'.html': 'text/html',
	'.css': 'text/css'
};

var cache = {
	store: {},
	maxSize: 26214400, //（bytes）25MB
	maxAge: 5400 * 1000, //（ミリ秒）1.5時間
	cleanAfter: 7200 * 1000, //（ミリ秒）2時間
	cleanedAt: 0, // 動的に設定されます
	clean: function(now) {
		if (now - this.cleanAfter > this.cleanedAt) {
			this.cleanedAt = now;
			var that = this;
			Object.keys(this.store).forEach(function (file) {
				if (now > that.store[file].timestamp + that.maxAge) {
					delete that.store[file];
				}
			});
		}
	}
};

http.createServer(function (request, response) {
	var lookup = path.basename(decodeURI(request.url)) || 'index.html',
	f = 'content/' + lookup;
	console.log(f);

	fs.exists(f, function (exists) {
		if (exists) {
			var headers = {'Content-Type': mimeTypes[path.extname(f)]};
			if (cache.store[f]) {
				console.log('cache ' + f);
				response.writeHead(200, headers);
				response.end(cache.store[f].content);
				return;
			}
			
			var s = fs.createReadStream(f).once('open', function () {
				response.writeHead(200, headers);
				this.pipe(response);
			}).once('error', function (e) {
				console.log(e);
				response.writeHead(500);
				response.end('サーバエラー！');
			});
			
			fs.stat(f, function (err, stats) {
				if (stats.size < cache.maxSize) {
					var bufferOffset = 0;
					cache.store[f] = {content: new Buffer(stats.size), timestamp: Date.now() };
					s.on('data', function (data) {
						data.copy(cache.store[f].content, bufferOffset);
						bufferOffset += data.length;
					});
				}
			});
			return;
		}
		response.writeHead(404);
		response.end('ページがみつかりません！');
	});
	cache.clean(Date.now());
}).listen(8080);
