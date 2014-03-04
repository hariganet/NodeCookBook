// 日本語の文字化けを防ぐため、サンプルコードにはcharset指定を含んだContent-Typeヘッダを追加しています。

var express = require('express');
var http = require('http');
var crypto = require('crypto');

var userStore = {};
var app = express();

app.use(express.bodyParser());

app.get('/', function (req, res) {
	res.sendfile('regform.html');
});

app.post('/', function (req, res) {
	if (req.body && req.body.user && req.body.pass) {
		var hash = crypto
			.createHmac('md5', 'supersecretkey')
			.update(req.body.pass)
			.digest('hex');
		userStore[req.body.user] = hash;
		res.set('Content-Type', 'text/html; charset=utf-8');
		res.send('登録ありがとうございます、' + req.body.user + 'さん！');
		console.log(userStore);
	}
});

http.createServer(app).listen(8080);