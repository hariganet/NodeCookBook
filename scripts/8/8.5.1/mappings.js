function appServe(dir) {
	return require('./sites/' + dir + '/app.js');
}

exports.sites = {
	'nodecookbook': appServe('nodecookbook'),
	'localhost-site': appServe('localhost-site')
};