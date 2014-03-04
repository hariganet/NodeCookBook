var http = require('http');
var formidable = require('formidable');
var form = require('fs').readFileSync('form.html');

http.createServer(function (req, res) {
	if (req.method === 'GET') {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(form);
	}
	if (req.method === 'POST') {
		var incoming = new formidable.IncomingForm();
		incoming.uploadDir = 'uploads';
		incoming.on('fileBegin', function (field, file) {
			if (file.name) {
				file.path += '-' + file.name;
			}
		}).on('file', function (field, file) {
			if (!file.size) { return; }
			res.write(file.name + 'を受け取りました\n');
		}).on('field', function (field, value) {
			res.write(field + ' : ' + value + '\n');
		}).on('end', function () {
			res.end('すべてのデータを受け取りました');
		});
		incoming.parse(req);
	}
}).listen(8080);