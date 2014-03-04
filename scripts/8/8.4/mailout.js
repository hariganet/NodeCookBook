var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport('SMTP', {
	host: 'localhost',
	secureConnection: false,
	port: 2525,
	auth: {
		user: 'node',
		pass: 'cookbook'
	}
});

var msg = {
	from: 'スパマーではありません <spamnot@nodecookbook.com>',
	subject: 'ニュースレター',
	text: 'こんにちは！ニュースレターです。',
	encoding: 'UTF-8'
};

var maillist = [
	'Bob <bob@nodecookbook.com>, Bib <bib@nodecookbook.com>',
	'Miss Susie <susie@nodecookbook.com>',
	'Nobody <nobody@nodecookbook.com>'
];

var i = 0;
maillist.forEach(function (to) {
	msg.to = to;
	transport.sendMail(msg, function (err) {
		if (err) {
			console.log(to + 'への送信に失敗しました。');
		} else {
			console.log(to + 'へ送信しました。');
		}
		i += 1;
		if (i === maillist.length) { msg.transport.close(); }
	});
});

