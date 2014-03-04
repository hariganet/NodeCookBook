// 日本語の文字化けを防ぐため、サンプルコードにはcharset指定を含んだContent-Typeヘッダを追加しています。
// key.pemとcert.pemをあらかじめ用意しておいてください。
// http://psginc.jp/nodecookbookにサポート情報があります。

var https = require('https');
var fs = require('fs');

var opts = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
}

https.createServer(opts, function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
	res.end('セキュア！');
}).listen(4443); // 本番環境では443