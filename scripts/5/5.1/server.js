var http = require('http');
var WSServer = require('websocket').server;
var url = require('url');
var clientHtml = require('fs').readFileSync('client.html');

var plainHttpServer = http.createServer(function (req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end(clientHtml);
}).listen(8080);

var webSocketServer = new WSServer({ httpServer: plainHttpServer });
var accept = ['localhost', '127.0.0.1'];

webSocketServer.on('request', function (req) {
	req.origin = req.origin || '*'; // req.originが存在しない場合は*をワイルドカードとして使用
	if (accept.indexOf(url.parse(req.origin).hostname) === -1) {
		req.reject();
		console.log(req.origin + 'からのアクセスは許可されていません');
		return;
	}
	
	var websocket = req.accept(null, req.origin);
	
	websocket.on('message', function (msg) {
		console.log('"' + msg.utf8Data + '" を ' + req.origin + ' から受信');
		if (msg.utf8Data === 'Hello') {
			websocket.send('WebSocketサーバからこんにちは！');
		}
	});
	
	websocket.on('close', function (code, desc) {
		console.log('接続解除：' + code + ' - ' + desc);
	});
	
});
