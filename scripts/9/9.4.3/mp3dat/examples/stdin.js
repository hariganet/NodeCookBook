// レシピ9.4.1 ユースケース：STDINストリーム
// 使用方法
// cat ../test/test.mp3 | node stdin.js 82969
// 2つ目の引数（82969）はファイルサイズ（バイト）

if (!process.argv[2]) {
	process.stderr.write('mp3のファイルサイズをbyteで入力してください。');
	process.exit();
}

var mp3dat = require('../');
process.stdin.resume();
mp3dat.stat({
	stream: process.stdin,
	size: process.argv[2]
}, function(err, stats) {
	if (err) { console.log(err); }
	console.log(stats);
});