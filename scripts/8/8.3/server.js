var net = require('net');
var stats = new (require('events').EventEmitter);
var filter = 'User-Agent';

var fauxHttp = net.createServer(function(socket) { // fauxは「偽造」
	socket.write('こんにちは。TCPです。\n');
	socket.end();
	
	socket.on('data', function(data) {
		stats.emit('stats', data.toString());
	});
}).listen(8080);

var monitorInterface = net.createServer(function(socket) {
	stats.on('stats', function(stats) {
		var header = stats.match(filter + ':') || stats.match('');
		header = header.input.substr(header.index).split('\r\n')[0];
		socket.write(header);
	});
	socket.write('フィルタを指定してください（「User-Agent」など）');
	socket.on('data', function(data) {
		filter = data.toString().replace('\n', '');
		socket.write(filter + ' をフィルタしています…');
	});
}).listen(8081);