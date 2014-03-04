
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.mrpage = function(req, res) {
	res.send('こんにちは。Mr. Pageです。');
};

exports.anypage = function(req, res) {
	res.send('こんにちは。Mr. ' + req.params.page + 'です。');
};
