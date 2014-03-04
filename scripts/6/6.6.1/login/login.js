var users = { 'dave': 'expressrocks' };

module.exports = function(req, res, next) {
	var method = req.method.toLowerCase(); // メソッド名をキャッシュしておきます
	var user = req.body.user;
	var logout = (method === 'delete');
	var login = (method === 'post' && user);
	
	routes = req.app.routes[method];
	
	if (!routes) { next(); return; }
	if (login || logout) {
		routes.forEach(function(route) {
			if (!(req.url.match(route.regexp))) {
				req.method = 'GET';
			}
		});
	}
	if (logout) {
		delete req.session.user;
	}
	if (login) {
		Object.keys(users).forEach(function(name) {
			if (user.name === name && user.pwd === users[name]) {
				req.session.user = {
					name: user.name,
					pwd: user.pwd
				};
			}
		});
	}
	next();
}
