// 日本語の文字化けを防ぐため、サンプルコードにはcharset指定を含んだContent-Typeヘッダを追加しています。

var http = require('http');
var crypto = require('crypto');

var username = 'dave';
var password = 'digestthis!';
var realm = 'Node Cookbook';
var opaque;

function md5(msg) {
	return crypto.createHash('md5').update(msg).digest('hex');
}

opaque = md5(realm);

function authenticate(res) {
	res.writeHead(401, {
		'WWW-Authenticate': 'Digest realm="' + realm + '"'
		+ ',qop="auth",nonce="' + Math.random() + '"'
		+ ',opaque="' + opaque + '"',
		'Content-Type': 'text/html; charset=utf-8'
	});
	res.end('認証が必要です。');
}

function parseAuth(auth) {
	var authObj = {};
	auth.split(', ').forEach(function (pair) { // splitに渡す文字列にスペースが入っています
		pair = pair.split('=');
		authObj[pair[0]] = pair[1].replace(/"/g,'');
	});
	return authObj;
}

http.createServer(function(req, res) {
	var auth, user, digest = {};
	
	if (!req.headers.authorization) {
		authenticate(res);
		return;
	}
	
	auth = req.headers.authorization.replace(/^Digest /, '');
	auth = parseAuth(auth);
	if (auth.username !== username) { authenticate(res); return; }
	
	digest.ha1 = md5(auth.username + ':' + realm + ':' + password);
	digest.ha2 = md5(req.method + ':' + auth.uri);
	
	digest.response = md5([
		digest.ha1,
		auth.nonce, auth.nc, auth.cnonce, auth.qop,
		digest.ha2
	].join(':'));
	
	if(auth.response !== digest.response) { authenticate(res); return; }
	res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
	res.end('ログインできました！');
}).listen(8080);