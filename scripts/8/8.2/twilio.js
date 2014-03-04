var twilio = require('twilio');
var settings = {
	sid: 'AC73b3873bc6744e488b0c1c1fc2addb3a',
	token: '4ae24e0c48fe0effbc2920bc95df762f',
	hostname: 'dummyhost',
	phonenumber: '+14248357370' // sandbox番号
}

var restClient = new (twilio.RestClient)(settings.sid, settings.token);
var client = new (twilio.Client)(settings.sid, settings.token, settings.hostname);
var phone = client.getPhoneNumber(settings.phonenumber);

console.log(twilio);

var smslist = [
	'+819017368716'
];

var msg = 'SMSです。';
smslist.forEach(function (to) {
	phone.sendSms(to, msg, {}, function(sms) {
		function checkStatus(smsInstance) {
			restClient.getSmsInstance(smsInstance.sid, function (presentSms) {
				if (presentSms.status === 'sent') {
					console.log(presentSms.to + 'に送信しました。');
				} else {
					if (isNaN(presentSms.status)) {
						setTimeout(checkStatus, 1000, presentSms);
						return;
					}
					console.log('APIエラー：' + presentSms.message);
				}
				i += 1;
				if (i === smslist.length) { process.exit(); }
			});
		};
	});
});