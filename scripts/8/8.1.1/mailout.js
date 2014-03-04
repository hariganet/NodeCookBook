var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport('sendmail');
// sendmailがPATHで見つからない場合は、sendmailのパスを特定しておき、以下のように設定します。
// var transport = nodemailer.createTransport('Sendmail', '/path/to/sendmail');

var msg = {
	from: 'スパマーではありません <spamnot@nodecookbook.com>',
	subject: 'ニュースレター',
	text: 'こんにちは！ニュースレターです。'
};


var maillist = [
	'一人目 <mailtest1@mailinator.com>',
	'二人目 <mailtest2@mailinator.com>',
	'三人目 <mailtest3@mailinator.com>',
	'四人目 <mailtest4@mailinator.com>',
	'五人目 <mailtest5@mailinator.com>'
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

