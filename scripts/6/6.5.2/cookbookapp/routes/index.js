
/*
 * GET home page.
 */

var profiles = require('../profiles.js'); // 追加
exports.index = function(req, res){
  res.render('index', { title: 'Profiles', profiles: profiles }); // 変更
};