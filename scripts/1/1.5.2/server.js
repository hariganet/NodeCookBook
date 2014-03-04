var static = require('node-static');
var file = new(static.Server)('.', { cache: 7200, headers: { 'X-Hello':'World' } });

require('http').createServer(function(request, response) {
	request.addListener('end', function () {
		file.serve(request, response, function (err, res) {
			if (err) {
				// 配信失敗
				console.error("> 次のファイルを配信できませんでした：" + request.url + " - " + err.message);
				response.writeHead(err.status, err.headers);
				response.end();
			} else {
				// 配信成功
				console.log("> " + request.url + " - " + res.message);
			}
		});
	});
}).listen(8080);