var mp3dat = require('../index.js'); // シングルトン
var mp3dat2 = mp3dat.spawnInstance(); // 別インスタンス

mp3dat.stat('../test/test.mp3', function(err, stats) {
	console.log(stats);
});

mp3dat.stat('../test/test2.mp3', function(err, stats) {
	console.log(stats);
});