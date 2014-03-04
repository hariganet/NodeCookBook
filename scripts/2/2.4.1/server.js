// 以下のコマンドで「50meg」というファイルを作成しておいてください。
// dd if=/dev/zero of=50meg count=50 bs=1048576

var http = require('http');
var fs = require('fs');

var options = {}
options.file = '50meg';
options.fileSize = fs.statSync(options.file).size;
options.kbps = 32;

http.createServer(function(req, res) {
	var download = Object.create(options);
	download.readStreamOptions = {};
	download.chunks = new Buffer(download.fileSize);
	download.bufferOffset = 0;
	download.statusCode = 200;
	download.headers = {'Content-Length': download.fileSize};
	if (req.headers.range) {
		download.start = req.headers.range.replace('bytes=','').split('-')[0];
		download.readStreamOptions = {start: +download.start};
		download.headers['Content-Range'] = 'bytes ' + download.start +
		'-' + download.fileSize + '/' + download.fileSize;
		download.statusCode = 206; //partial contentDocument
	}
	
	res.writeHeader(download.statusCode, download.headers);
	
	fs.createReadStream(download.file)
		.on('data', function(chunk) {
			chunk.copy(download.chunks,download.bufferOffset);
			download.bufferOffset += chunk.length;
		}).once('open', function () {
			var handleAbort = throttle(download, function (send) {
				res.write(send);
			});
			req.on('close', function () {
				handleAbort();
			});
		});
}).listen(8080);

function throttle(download, cb) {
	var chunkOutSize = download.kbps * 1024;
	var timer = 0;
	
	(function loop(bytesSent) {
		var remainingOffset;
		if(!download.aborted) {
			setTimeout(function () {
				var bytesOut = bytesSent + chunkOutSize;
				if (download.bufferOffset > bytesOut) {
					timer = 1000;
					cb(download.chunks.slice(bytesSent, bytesOut));
					loop(bytesOut);
					return;
				}
				if (bytesOut >= download.chunks.length) {
					remainingOffset = download.chunks.length - bytesSent;
					cb(download.chunks.slice(remainingOffset, bytesSent));
					return;
				}
				loop(bytesSent);
			}, timer);
		}
	}(0));
	return function () {
		download.aborted = true;
	};
}
