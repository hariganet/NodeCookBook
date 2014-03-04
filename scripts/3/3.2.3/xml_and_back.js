var profiles = require('./profiles');
var parser = new (require('xml2js')).Parser({
	trim: true, // trueの場合、テキストノード前後のホワイトスペースを削除します
	explicitArray: false // trueの場合、子ノードを強制的に配列に格納します
});

function buildXML (rootObj, rootName) {
	var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
	rootName = rootName || 'xml';
	xml += '<' + rootName + '>\n';
	
	function attributes(obj, key) {
		if (obj[key].hasOwnProperty("$")) {
			xml = xml.substr(0, xml.length - 1); // openタグから>を削除
			Object.keys(obj[key]['$']).forEach(function (attrKey) {
				xml += ' ' + attrKey + '="' + obj[key]['$'][attrKey] + '"';
			});
			xml += ">"; // openタグから削除した>を再度加える
			delete obj[key]['$']; // 再度オブジェクトとしてtraverse関数で再帰しないように削除しておく
		}
	}
	(function traverse(obj) {
		Object.keys(obj).forEach(function (key) {
			var open = "<" + key + ">";
			var close = "</" + key + ">\n";
			var nonObj = (obj[key] && {}.toString.call(obj[key]) !== "[object Object]");
			var isArray = Array.isArray(obj[key]);
			var isFunc = (typeof obj[key] === "function");
			
			if (isArray) {
				obj[key].forEach(function (xmlNode) {
					var childNode = {};
					childNode[key] = xmlNode;
					traverse(childNode);
				});
				return;
			}
			
			if (key === '_') {
				xml += obj[key] + '\n';
				return;
			}
			
			xml += open;
			attributes(obj, key);
			
			if (nonObj) {
				xml += (isFunc) ? obj[key]() : obj[key];
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
	console.log(profiles.bert);
});

