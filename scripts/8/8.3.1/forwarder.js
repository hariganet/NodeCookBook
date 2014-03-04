var net = require('net');
var fromPort = process.argv[2] || 9000;
var toPort = process.argv[3] || 22;

net.createServer(function (socket) {
	var client;
	socket.on('connect', function () {
		client = net.connect(toPort);
		client.on('data', function (data) {
			socket.write(data);
		});
	}).on('data', function (data) {
		client.write(data);
	}).on('end', function (data) {
		client.end();
	});
}).listen(fromPort, function () {
	console.log(this.address().port + 'から' + toPort + 'に転送中');
});

