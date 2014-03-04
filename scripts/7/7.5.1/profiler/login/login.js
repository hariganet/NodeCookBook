var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/profiler');
var users = db.collection('users');

function validate(user, cb) {
	users.findOne({ name: user.name, pwd: user.pwd }, function(err, user) {
		if (err) { throw err; }
		if (!user) {
			cb({ msg: 'ログイン情報に誤りがあります。' });
			return;
		} 
		cb();
	});
}
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