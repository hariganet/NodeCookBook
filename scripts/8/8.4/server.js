var simplesmtp = require('simplesmtp');
var fs = require('fs');
var users = [{ user: 'node', pass: 'cookbook' }];
var mailboxDir = './mailboxes/';
var catchall = fs.createWriteStream(mailboxDir + 'caught', {flags: 'a'});

var smtp = simplesmtp
	.createServer({requireAuthentication: true}) // 架空のメールサーバでテストする場合はdisableDNSValidation: trueを設定
	.on('authorizeUser', function (envelope, user, pass, cb) {
		var authed;
		users.forEach(function (userObj) {
			if (userObj.user === user && userObj.pass === pass) {
				authed = true;
			}
		});
		cb(null, authed);
	});
	

smtp.on('startData', function (envelope) {
	var rcpt;
	var saveTo;
	envelope.mailboxes = [];
	envelope.to.forEach(function (to) {
		fs.exists(mailboxDir + to.split('@')[0], function (exists) {
			rcpt = to.split('@')[0];
			if (exists) {
				envelope.mailboxes.unshift(rcpt);
				saveTo = mailboxDir + rcpt + '/' + envelope.from + ' - ' + envelope.date;
				envelope[rcpt] = fs.createWriteStream(saveTo);
				return;
			}
		
			envelope.mailboxes.unshift(rcpt);
			console.log(rcpt + '：メールボックスが見つかりませんでした。caughtファイルに送ります。');
			envelope[rcpt] = catchall;
		});
	});
});

smtp.on('data', function (envelope, chunk) {
	envelope.mailboxes.forEach(function (rcpt) {
		envelope[rcpt].write(chunk);
	});
}).on('dataReady', function (envelope, cb) {
	envelope.mailboxes.forEach(function (rcpt) {
		if (envelope[rcpt] === catchall) {
			envelope[rcpt].write('\r\n\r\n');
		} else {
			envelope[rcpt].end();
		}
	});
	cb(null, Date.now());
});


/* from/subject文字化け対策コード
** smtp.on('startData'...終了以降を入れ替え

var headerReady = [];
var content = [];
function decoder(str, p, offset) {
	return decodeURIComponent(p.replace(/=/g,'%'));
}

smtp.on('data', function (envelope, chunk) {
	var to = envelope.to.toString(); // toプロパティの値のみを個別メール識別キーに利用しているため、同じtoに複数のメールが同時に送信される場合に誤動作する可能性があります。
	content[to] = content[to] + chunk;
	if (!headerReady[to]) {
		if (content[to].toString().match('\r\n\r\n')) { // メッセージヘッダ終了判定
			content[to] = content[to].replace(/\?=\r\n\s=\?UTF-8\?Q\?/g, ''); // エンコードが複数行にまたがる場合の改行を削除
			content[to] = content[to].replace(/=\?UTF-8\?Q\?(.*)\?=/g, decoder, 'g'); // URLデコード
			headerReady[to] = true;
		}
	}
	if (headerReady[to]) {
		envelope.mailboxes.forEach(function (rcpt) {
			envelope[rcpt].write(content[to]);
		});
		content[to] = '';
	}
}).on('dataReady', function (envelope, cb) {
	var to = envelope.to.toString();
	envelope.mailboxes.forEach(function (rcpt) {
		if (envelope[rcpt] === catchall) {
			envelope[rcpt].write('\r\n\r\n');
		} else {
			envelope[rcpt].end();
		}
	});
	headerReady[to] = false;
	cb(null, Date.now());
});
*/


smtp.listen(2525);
