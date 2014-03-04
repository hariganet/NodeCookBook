var http = require('http');
var fs = require('fs');
var path = require('path');
var xml2js = new (require('xml2js')).Parser({
	trim: true,
	explicitArray: false
});
var profiles = require('./profiles');
var buildXml = require('./buildXml');
var buildXmljs = buildXml.toString();
var index = fs.readFileSync('index.html');
var mimes = {
	js: "application/javascript",
	xml: "application/xml",
	json: "application/json"
};

function output(content, format, rootNode) {
	if (!format || format === 'json') {
		return JSON.stringify(content);
	}
	if (format === 'xml') {
		return buildXml(content, rootNode);
	}
}

var routes = {
	'profiles': function (format) {
		return output(Object.keys(profiles), format);
	},
	'/profile': function (format, basename) {
		return output(profiles[basename], format, basename);
	},
	'buildXml' : function(ext) {
		if (ext === 'js') { return buildXmljs; }
	}
};

function addProfile(req,cb) {
	var newProf;
	var profileName;
	var pD = ''; // POSTデータ
	req.on('data', function (chunk) {
		pD += chunk;
	}).on('end', function() {
		var contentType = req.headers['content-type'];
		if (contentType === 'application/json') {
			newProf = JSON.parse(pD);
		}
		if (contentType === 'application/xml') {
			xml2js.parseString(pD, function(err,obj) {
				newProf = obj;
			});
		}
		profileName = newProf.profileName;
		profiles[profileName] = newProf;
		delete profiles[profileName].profileName;
		cb(output(profiles[profileName],　contentType.replace('application/', ''),　profileName));
	});
}

http.createServer(function (req, res) {
	var dirname = path.dirname(req.url);
	var extname = path.extname(req.url);
	var basename = path.basename(req.url, extname);
	extname = extname.replace('.',''); // ピリオドを削除します。
	res.setHeader("Content-Type", mimes[extname] || 'text/html');
	
	if (req.method === 'POST') {
		addProfile(req, function(output) {
			res.end(output);
		});
		return;
	}
	if (routes.hasOwnProperty(dirname)) {
		res.end(routes[dirname](extname, basename));
		return;
	}
	if (routes.hasOwnProperty(basename)) {
		res.end(routes[basename](extname));
		return;
	}
	res.end(index);
}).listen(8080);
