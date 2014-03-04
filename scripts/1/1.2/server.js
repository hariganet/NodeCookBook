// 日本語の文字化けを防ぐため、サンプルコードにはcharset指定を含んだContent-Typeヘッダを追加しています。

var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	'.js': 'text/javascript',
	'.html': 'text/html',
	'.css': 'text/css'
};

http.createServer(function (request, response) {
	var lookup = path.basename(decodeURI(request.url)) || 'index.html',
	f = 'content/' + lookup;
	fs.exists(f, function (exists) {
		if (exists) {
			fs.readFile(f, function(err, data) {
				if (err) {
					response.writeHead(500);
					response.end('Server Error!');
					return;
				}
				var headers = {'Content-Type': mimeTypes[path.extname(f)] + ';charset=utf-8'};
				response.writeHead(200, headers);
				response.end(data);
			});
			return;
		}
		response.writeHead(404);
		response.end('ページがみつかりません！');
	});
}).listen(8080);
