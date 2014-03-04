var profiles = require('../models/profiles');

function patchMixins(req, res, mixins) {
	if (!req.session || !req.session.user) {
		var noop = function() {};
		var dummies = {};
		mixins.forEach(function(mixin) {
			res.locals[mixin + '_mixin'] = noop;
		});
	}
}

exports.index = function(req, res){
	profiles.pull(req.params.pagenum, function(err, profiles) {
		if (err) { console.log(err); }
		patchMixins(req, res, ['add', 'del', 'adminScript']);
		res.render('index', { title: 'Profiler', profiles: profiles, page: req.params.pagenum })
	});
};
