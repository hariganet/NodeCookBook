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
		validate(user, function(err) {
			if(!err) {
				req.session.user = {
					name: user.name,
					pwd: user.pwd
				};
			} else {
				req.flash('error', err.msg);
				req.url = '/';
			}
			next();
		});
	} else {
		if(!req.session.user) { req.url = '/'; }
		next();
	}
}

function validate(user, cb) {
	var valid = Object.keys(users).some(function(name) {
		return (user.name === name && user.pwd === users[name]);
	});
	cb((!valid && { msg: 'ログイン情報に誤りがあります。' }));
}
