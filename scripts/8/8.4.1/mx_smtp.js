var simplesmtp = require('simplesmtp');
var fs = require('fs');
var mailboxDir = './mailboxes/';
var catchall = fs.createWriteStream(mailboxDir + 'caught', {flags: 'a'});

var smtp = simplesmtp.createServer();
	

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
			console.log(rcpt + '：メールボックスが見つかりませんでした。caughtファイルに送ります。')
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

smtp.listen(25);
