var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/profiler');
var profs = db.collection('profiles');

exports.pull = function pull(page, cb) {
	var p = {};
	var rowsPer = 2;
	var skip;
	var errs;
	
	page = page || 1;
	skip = (page - 1) * rowsPer;
	
	profs.findEach({}, { limit: rowsPer, skip: skip }, function(err, doc) {
		if (err) { errs = errs || []; errs.push(err); }
		if (doc) {
			p[doc._id] = doc;
			delete p[doc._id]._id;
			return;
		}
		cb(errs, p);
	});
}

exports.del = function(profile, cb) {
	profs.removeById(profile, cb);
}

exports.add = function(profile, cb) {
	profs.insert(profile.profile, cb);
}
