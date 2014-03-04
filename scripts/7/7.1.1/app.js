// 日本語の文字化けを防ぐため、サンプルコードにはcharset指定を含んだContent-Typeヘッダを追加しています。

var http = require('http');
var express = require('express');
var username = 'dave';
var password = 'ILikeBrie_33';
var realm = 'Node Cookbook';

var app = express();

app.use(express.basicAuth(function (user, pass) {
	return username === user && password === pass;
}, realm));

app.get('/:route?', function (req, res) {
	res.set('Content-Type', 'text/html; charset=utf-8');
	res.end('柔らかいチーズが好きだ！');
});

http.createServer(app).listen(8080);
