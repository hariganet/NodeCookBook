var assert = require('assert');
var mp3dat = require('../index.js');
var testFile = 'test/test.mp3';

assert(mp3dat, 'mp3datのロードに失敗しました。');
assert(mp3dat.stat, 'mp3dat.statメソッドが存在しません。');
assert(mp3dat.stat instanceof Function, 'mp3dat.statはfunctionでなければなりません。');

mp3dat.stat(testFile, function(err, stats) {
	assert.ifError(err);
	
	// プロパティの存在確認
	assert(stats.duration, 'durationが存在しなければなりません。');
	assert(stats.bitrate, 'bitrateが存在しなければなりません。');
	assert(stats.filesize, 'filesizeが存在しなければなりません。');
	assert(stats.timestamp, 'timestampが存在しなければなりません。');
	assert(stats.timesig, 'timesigが存在しなければなりません。');
	
	// プロパティのtype確認
	assert.equal(typeof stats.duration, 'object', 'durationはオブジェクトタイプでなければなりません。');
	assert(stats.duration instanceof Object, 'durationはObjectのインスタンスでなければなりません。');
	assert(!isNaN(stats.bitrate), 'bitrateは数値でなければなりません。');
	assert(!isNaN(stats.filesize), 'filesizeは数値でなければなりません。');
	assert(!isNaN(stats.timestamp), 'timestampは数値でなければなりません。');
	assert(stats.timesig.match(/^\d+:\d+:\d+$/), 'timesigはHH:MM:SSフォーマットでなければなりません。');
	
	// durationプロパティの各値の存在確認
	assert.notStrictEqual(stats.duration.hours, undefined, 'duration.hoursはundefined以外でなければなりません。');
	assert.notStrictEqual(stats.duration.minutes, undefined, 'duration.minutesはundefined以外でなければなりません。');
	assert.notStrictEqual(stats.duration.seconds, undefined, 'duration.secondsはundefined以外でなければなりません。');
	assert.notStrictEqual(stats.duration.milliseconds, undefined, 'duration.millisecondsはundefined以外でなければなりません。');
	
	// durationプロパティの各値のタイプ
	assert(!isNaN(stats.duration.hours), 'duration.hoursは数値でなければなりません。');
	assert(!isNaN(stats.duration.minutes), 'duration.minutesは数値でなければなりません。');
	assert(!isNaN(stats.duration.seconds), 'duration.secondsは数値でなければなりません。');
	assert(!isNaN(stats.duration.milliseconds), 'duration.millisecondsは数値でなければなりません。');
	
	// durationプロパティの各値の制限
	assert(stats.duration.minutes < 60, 'duraion.minutesは60より小さくなければなりません。');
	assert(stats.duration.seconds < 60, 'duraion.secondsは60より小さくなければなりません。');
	assert(stats.duration.milliseconds < 1000, 'duraion.millisecondsは1000より小さくなければなりません。');
	
	console.log('すべてのテストに合格しました。');
	
});

