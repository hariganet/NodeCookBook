var cradle = require('cradle');
var db = new (cradle.Connection)({
	auth: {
		username: 'node',
		password: 'cookbook'
	}
}).database('quotes');

var admin_lock = function (newDoc, savedDoc, userCtx) {
	if (userCtx.roles.indexOf('_admin') === -1) {
		throw({unauthorized: '管理者権限がありません'});
	}
}

db.save('_design/_auth', {
	views: {},
	validate_doc_update: admin_lock.toString()
});