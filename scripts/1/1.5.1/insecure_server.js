var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');

var whitelist = [
	'/index.html',
	'/subcontent/styles.css',
	'/subcontent/script.js'
];

http.createServer(function (request, response) {
	var lookup = url.parse(decodeURI(request.url)).pathname;
	lookup = path.normalize(lookup); // この行をコメントアウトするとディレクトリトラバーサル攻撃をテストできます。
	lookup = (lookup === "/") ? '/index.html' : lookup;
	
	if (whitelist.indexOf(lookup) === -1) {
		response.writeHead(404);
		response.end('ページが見つかりません！');
		return;
	}
	
	var f = 'content' + lookup;
	console.log(f);
	fs.readFile(f, function (err, data) {
		response.end(data);
	});
}).listen(8080);
