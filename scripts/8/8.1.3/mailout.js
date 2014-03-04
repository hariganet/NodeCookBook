var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport('SMTP', {
	host: 'smtp.gmail.com',
	secureConnection: true,
	port: 465,
	auth: {
		user: 'ユーザ名@gmail.com',
		pass: 'パスワード'
	}
});

var msg = {
	from: '添付する人 <attacher@files.com>',
	to: '送信先ユーザ名@example.com',
	subject: '目のない鹿をなんて呼ぶ？',
	text: '添付ファイルを見てください。',
	attachments: [
		{ fileName: 'deer.txt', contents: 'わかりません。ノーアイデア！（* 訳注：ノー・アイ・ディアー！（目のない鹿）→ノーアイデア！）' },
		{ fileName: 'deerWithEyes.jpg', filePath: 'deer.jpg' },
	]
};

transport.sendMail(msg, function (err) {
	if (err) {
		console.log(msg.to + 'への送信に失敗しました。');
	} else {
		console.log(msg.to + 'へ送信しました。');
	}
	msg.transport.close();
});

