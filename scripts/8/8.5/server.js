var http = require('http');
var port = 8080;
var mappings = require('./mappings');

var server = http.createServer(function (req, res) {
	var domain = req.headers.host.replace(new RegExp(':' + port + '$'), '');
	var site = mappings.sites[domain];
	
	if (site) { site.serve(req, res); return; }
	
	res.writeHead(404);
	res.end('見つかりません。');
}).listen(port);
