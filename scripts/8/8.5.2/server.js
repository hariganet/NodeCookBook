// 各サイトのcertsディレクトリにそれぞれのkey.pemとcert.pemをあらかじめ用意しておいてください。
// http://psginc.jp/nodecookbookにサポート情報があります。

var https = require('https');
var port = 8080;
var mappings = require('./mappings');

var server = https.createServer({}, function (req, res) {
	var domain = req.headers.host.replace(new RegExp(':' + port + '$'), '');
	var site = mappings.sites[domain];
	
	if (site) { site.content.serve(req, res); return; }
	
	res.writeHead(404);
	res.end('見つかりません。');
}).listen(port, '0.0.0.0');

Object.keys(mappings.sites).forEach(function (hostname) {
	server.addContext(hostname, {
		key: mappings.sites[hostname].key,
		cert: mappings.sites[hostname].cert
	});
});