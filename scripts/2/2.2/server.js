var http = require('http');
var formidable = require('formidable');
var form = require('fs').readFileSync('form.html');

http.createServer(function (req, res) {
	if (req.method === 'GET') {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(form);
	}
	if (req.method === 'POST') {
		console.log(req.headers);
		var incoming = new formidable.IncomingForm();
		incoming.uploadDir = 'uploads';
		incoming.on('file', function (field, file) {
			console.log(file);
			if (!file.size) { return; }
			res.write(file.name + 'を受け取りました\n');
		}).on('end', function () {
			console.log('end');
			res.end('すべてのファイルを受け取りました');
		});
		incoming.parse(req);
	}
}).listen(8080);