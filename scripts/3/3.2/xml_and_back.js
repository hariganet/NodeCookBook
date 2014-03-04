var profiles = require('./profiles');
var parser = new (require('xml2js')).Parser({
	trim: true, // trueの場合、テキストノード前後のホワイトスペースを削除します
	explicitArray: false // trueの場合、子ノードを強制的に配列に格納します
});

function buildXML (rootObj, rootName) {
	var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
	rootName = rootName || 'xml';
	xml += '<' + rootName + '>\n';
	
	(function traverse (obj) {
		Object.keys(obj).forEach(function (key) {
			var open = '<' + key + '>';
			var close = '</' + key + '>\n';
			var isTxt = (obj[key] && {}.toString.call(obj[key]) !== '[object Object]');
			
			xml += open;
			
			if(isTxt) {
				xml += obj[key];
				xml += close;
				return;
			}
			
			xml += '\n';
			traverse (obj[key]);
			xml += close;	
			
		});
	}(rootObj));
	
	xml += '</' + rootName + '>\n';
	return xml;
}

profiles = buildXML(profiles, 'profiles').replace(/name/g,'fullname');
console.log(profiles); // XMLを表示します。

parser.parseString(profiles, function (err, obj) {
	profiles = obj.profiles;
	profiles.felix.fullname = "Felix Geisendörfer";
	console.log(profiles.felix); 
});
