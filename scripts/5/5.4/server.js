var http = require('http');
var clientHtml = require('fs').readFileSync('index.html');

http.createServer(function (request, response) {
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.end(clientHtml);
}).listen(8080);