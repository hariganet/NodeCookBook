var static = require('node-static');
var fs = require('fs');

function staticServe (dir) {
	return new (static.Server)('sites/' + dir);
}

function secureShare(domain) {
	var site = {
		content: staticServe(domain),
		cert: fs.readFileSync('sites/' + domain + '/certs/cert.pem'),
		key: fs.readFileSync('sites/' + domain + '/certs/key.pem')
	};
	return site;
};

exports.sites = {
	'nodecookbook.com': secureShare('nodecookbook.com'),
	'example.com': secureShare('example.com')
};

