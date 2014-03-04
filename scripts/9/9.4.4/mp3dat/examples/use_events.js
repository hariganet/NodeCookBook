var mp3dat = require('../index');

mp3dat
	.stat('../test/test.mp3')
	.on('bitrate', function (bitrate) {
		console.log('ビットレートを計算しました：' + bitrate);
	}).on('timesig', function (timesig) {
		console.log('タイムシグネチャを計算しました：' + timesig);
	}).on('stats', function (stats) {
		console.log('statsオブジェクトを生成しました：');
		console.log(stats);
		mp3dat.spawnInstance();
	}).on('error', function (error) {
		console.log('エラー：' + error);
	}).on('spawn', function (mp3dat2) {
		console.log('2つめのmp3dat：');
		console.log(mp3dat2);
	});