// 日本語の文字化けを防ぐため、サンプルコードにはcharset指定を含んだContent-Typeヘッダを追加しています。

var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	'.js': 'text/javascript',
	'.html': 'text/html',
	'.css': 'text/css'
};

cache = {}

function cacheAndDeliver(f, cb) {
	fs.stat(f, function(err, stats) {
		var lastChanged = Date.parse(stats.ctime);
		var isUpdated = (cache[f]) && lastChanged > cache[f].timestamp;
		if (!cache[f] || isUpdated) {
			fs.readFile(f, function(err, data) {
				console.log(f + 'をファイルから読み込みます。');
				if (!err) {
					cache[f] = {content: data, timestamp: Date.now()}
				}
				cb(err, data);
			});
			return;
		}
		console.log(f + 'をキャッシュから読み込みます。');
		cb(null, cache[f].content);
	});
}

http.createServer(function (request, response) {
	var lookup = path.basename(decodeURI(request.url)) || 'index.html',
	f = 'content/' + lookup;
	fs.exists(f, function (exists) {
		if (exists) {
			cacheAndDeliver(f, function(err, data) {
				if (err) {
					response.writeHead(500);
					response.end('Server Error!');
					return;
				}
				var headers = {'Content-Type': mimeTypes[path.extname(f)] + ';charset=utf-8' };
				response.writeHead(200, headers);
				response.end(data);
			});
			return;
		}
		response.writeHead(404);
		response.end('ページがみつかりません！');
	});
}).listen(8080);
