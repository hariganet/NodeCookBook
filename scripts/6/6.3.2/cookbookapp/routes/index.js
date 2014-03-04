
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

exports.anypageAdmin = function(req, res) {
	var admin = req.params.admin;
	if (admin) {
		if (['add', 'delete'].indexOf(admin) !== -1) {
			if (admin === 'add') {
				admin = '追加';
			} else {
				admin = '削除';
			}
			res.send(req.params.page + 'ページを' + admin + 'したいですか？');
			return;
		}
		res.send(404);
	}
}
