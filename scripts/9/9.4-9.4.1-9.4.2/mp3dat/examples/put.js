var mp3dat = require('../');
var http = require('http');
var fs = require('fs');
var form = fs.readFileSync('put_upload.html');

http.createServer(function(req, res) {
	if (req.method === "PUT") {
		mp3dat.statStream({
			stream: req,
			size: req.headers['content-length']
		}, function(err, stats) {
			if (err) { console.log(err); return; }
			console.log(stats);
		});
	}
	
	if (req.method === "GET") {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(form);
	}
}).listen(8080);