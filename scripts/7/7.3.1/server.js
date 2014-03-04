// 日本語の文字化けを防ぐため、サンプルコードにはcharset指定を含んだContent-Typeヘッダを追加しています。


var http = require('http');
var crypto = require('crypto');

var users = {
	'dave': { password: 'digestthis!' },
	'bob': { password: 'MyNamesBob:-D' }
}

var realm = 'Node Cookbook';
var opaque;

function md5(msg) {
	return crypto.createHash('md5').update(msg).digest('hex');
}

opaque = md5(realm);

function authenticate(res, username) {
	var uRealm = realm;
	var uOpaque = opaque;
	if (username) {
		uRealm = users[username].uRealm;
		uOpaque = users[username].uOpaque;
	}
	
	var wwwauth = 'Digest realm="' + uRealm + '"'
		+ ',qop="auth",nonce="' + Math.random() + '"'
		+ ',opaque="' + uOpaque + '"';
	
	console.log('*****wwwauth');
	console.log(wwwauth);
	
	res.writeHead(401, {
		'WWW-Authenticate': wwwauth,
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
	console.log('*****auth');
	console.log(auth);
	auth = parseAuth(auth);
	if (!users[auth.username]) { console.log('!users[auth.username]'); authenticate(res); return; }
	
	if (req.url === '/logout') {
		console.log('logout');
		users[auth.username].uRealm = realm + ' [' + Math.random() + ']';
		users[auth.username].uOpaque = md5(users[auth.username].uRealm);
		users[auth.username].forceLogOut = true;
		res.writeHead(302, {'Location': '/'});
		res.end();
		return;
	}
	
	if (users[auth.username].forceLogOut) {
		console.log('forcelogout');
		delete users[auth.username].forceLogOut;
		authenticate(res, auth.username);
	}

	digest.ha1 = md5(auth.username + ':'
		+ (users[auth.username].uRealm || realm) + ':'
		+ users[auth.username].password);
	digest.ha2 = md5(req.method + ':' + auth.uri);
	digest.response = md5([
		digest.ha1,
		auth.nonce, auth.nc, auth.cnonce, auth.qop,
		digest.ha2
	].join(':'));
	
	if(auth.response !== digest.response) {
		console.log('auth.response !== digest.response');
		console.log(auth.response + ':' +digest.response);
		// users[auth.username].uRealm = realm + ' [' + Math.random() + ']';
		// users[auth.username].uOpaque = md5(users[auth.username].uRealm);
		authenticate(res, auth.username);
		return;
	}
	
	console.log('about to respond');
	res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
	res.end(auth.username + 'がログインしました！<br><a href="logout">ログアウト</a>');
}).listen(8080);