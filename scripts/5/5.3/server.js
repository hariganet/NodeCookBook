var http = require('http');
var clientHtml = require('fs').readFileSync('client.html');

var plainHttpServer = http.createServer(function (req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end(clientHtml);
}).listen(8080);

var io = require('socket.io').listen(plainHttpServer);
io.set('origins', ['localhost:8080', '127.0.0.1:8080']);

io.sockets.on('connection', function (socket) {
	socket.on('give me a number', function (cb) {
		cb(4);
	});
	
	socket.emit('give me a sentence', function (sentence) {
		socket.send(new Buffer(sentence).toString('base64'));
	});
});
