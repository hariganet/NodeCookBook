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
		crypto.randomBytes(128, function (err, salt) {
			if (err) { throw err; }
			salt = new Buffer(salt).toString('hex');
			crypto.pbkdf2(req.body.pass, salt, 7000, 256, function (err, hash) {
				if (err) { throw err; }
				userStore[req.body.user] = {
					salt: salt,
					hash: (new Buffer(hash).toString('hex'))
				};
				res.set('Content-Type', 'text/html; charset=utf-8');
				res.send('登録ありがとうございます、' + req.body.user + 'さん！');
				console.log(userStore);
			});
		});	
	}
});

http.createServer(app).listen(8080);