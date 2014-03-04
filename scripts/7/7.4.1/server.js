// 日本語の文字化けを防ぐため、サンプルコードにはcharset指定を含んだContent-Typeヘッダを追加しています。
// key.pemとcert.pemをあらかじめ用意しておいてください。
// http://psginc.jp/nodecookbookにサポート情報があります。

var https = require('https');
var fs = require('fs');
var express = require('express');

var app = express();

app.get('/', function(req, res) {
	res.set('Content-Type', 'text/html; charset=utf-8');
	res.end('セキュア！');
});

var opts = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
}

https.createServer(opts, app).listen(4443); // 本番環境では443