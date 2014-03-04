var twilio = require('twilio');
var settings = {
	sid : 'AC73b3873bc6744e488b0c1c1fc2addb3a',//'Ad054bz5be4se5dd211295c38446da2ffd',
	token: '4ae24e0c48fe0effbc2920bc95df762f',
	hostname : 'ec2-50-112-223-133.us-west-2.compute.amazonaws.com',//'dummyhost',
	phonenumber: '+14248357370' //sandbox number
}

var client = new (twilio.Client)(settings.sid, settings.token, settings.hostname);
var phone = client.getPhoneNumber(settings.phonenumber);

phone.makeCall('+8100000000', {}, function(call) { // 自分の番号を入れる
	call.on('answered', function (req, res) {
		console.log('answered');
		res.append(new (twilio.Twiml).Say('Meet us in the abandoned factory'));
		res.append(new (twilio.Twiml).Say('Come alone', {voice:'woman'}));
		res.send();
	}).on('ended', function (req) {
		console.log('ended', req);
		process.exit();
	})
});

