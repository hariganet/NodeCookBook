var twilio = require('twilio');
var settings = {
	sid : 'AC9324d0c29717a3158ecfa9efc1cd9124',//'Ad054bz5be4se5dd211295c38446da2ffd',
	token: '197a874186601dad211425aec1a3351e',
	hostname : 'alosta.jp',//'dummyhost',
	phonenumber: '+17203364685' //sandbox number
}

var restClient = new (twilio.RestClient)(settings.sid, settings.token);
var client = new (twilio.Client)(settings.sid, settings.token, settings.hostname);
var phone = client.getPhoneNumber(settings.phonenumber);

var smslist = [
'+819091182900',
'+819085334912'
];

var msg = 'SMS Ahoy!', i = 0;
smslist.forEach(function (to) {
	phone.sendSms(to, msg, {}, function (sms) {
		function checkStatus(smsInstance) {
			console.log(smsInstance);	
			restClient.getSmsInstance(smsInstance.sid, function (presentSms) {
				if (presentSms.status === 'sent') {
					console.log('Sent to ' + presentSms.to);
				} else {
					console.log('presentSms status: ', presentSms.status);
					if (isNaN(presentSms.status)) {
						//retry: if its not a number (like 404, 401), it's not an error
						setTimeout(checkStatus, 1000, presentSms);
						return;
					}
					//it seems to be a number, let's notify, but carry on
					console.log('API error: ', presentSms.message);
				}
				i += 1;
				if (i === smslist.length) { process.exit(); }
			});
		};
		checkStatus(sms.smsDetails);
	});
});
