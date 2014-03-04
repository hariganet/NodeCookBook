var fs = require('fs');

function Mp3dat(f, size) {
	if(!(this instanceof Mp3dat)) {
		return new Mp3dat(f, size);
	}
	this.stats = { duration: {} };
}

// 4bitのhex値をビットレート（bps）に変換
// MPEG-1のビットレートのみをサポートします

Mp3dat.prototype._bitrates = {
	1: 32000,
	2: 40000,
	3: 48000,
	4: 56000,
	5: 64000,
	6: 80000,
	7: 96000,
	8: 112000,
	9: 128000,
	A: 160000,
	B: 192000,
	C: 224000,
	D: 256000,
	E: 320000
}

Mp3dat.prototype._magnitudes = ['hours', 'minutes', 'seconds', 'milliseconds'];

Mp3dat.prototype._pad = function(n) { return n < 10 ? '0' + n : n; }

Mp3dat.prototype._timesig = function() {
	var ts = '';
	var self = this;
	self._magnitudes.forEach(function(mag, i) {
		if (i < 3) {
			ts += self._pad(self.stats.duration[mag]) + ((i < 2) ? ':' : '');
		}
	});
	return ts;
}

Mp3dat.prototype._findBitRate = function(cb) {
	var self = this;
	var stream = self.stream || fs.createReadStream(self.f);
	stream.on('data', function (data) {
		var i = 0;
		for (i; i < data.length; i += 2) {
			if (data.readUInt16LE(i) === 64511) {
				self.bitrate = self._bitrates[data.toString('hex', i + 2, i + 3)[0]];
				this.destroy();
				cb(null);
				break;
			}
		}
	}).on('end', function() {
		cb(new Error('ビットレートが見つかりませんでした。本当にMPEG-1 MP3ですか？'));
	});
}

Mp3dat.prototype._buildStats = function(cb) {
	var self = this;
	var hours = (self.size / (self.bitrate / 8) / 3600);
	
	self._timeProcessor(hours, function(duration) {
		self.stats = {
			duration: duration,
			bitrate: self.bitrate,
			filesize: self.size,
			timestamp: Math.round(hours * 3600000),
			timesig: self._timesig(duration, self.magnitudes)
		};
	cb(null, self.stats);
	});
}

Mp3dat.prototype._timeProcessor = function(time, counter, cb) {
	var self = this;
	var timeArray = [];
	var factor = (counter < 3) ? 60 : 1000;
	var magnitudes = self._magnitudes;
	var duration = self.stats.duration;
	
	if (counter instanceof Function) {
		cb = counter;
		counter = 0;
	}
	
	if (counter) {
		timeArray = (factor * ('0.' + time)).toString().split('.');
	}
	
	if (counter < magnitudes.length - 1) {
		duration[magnitudes[counter]] = timeArray[0] || Math.floor(time);
		duration[magnitudes[counter]] = +duration[magnitudes[counter]];
		counter += 1;
		self._timeProcessor.call(self, timeArray[1] || time.toString().split('.')[1], counter, cb);
		return;
	}
	
	duration[magnitudes[counter]] = Math.round(timeArray.join('.'));
	cb(duration);
}

Mp3dat.prototype.stat = function(f, cb) {
	var self = this;
	var isOptsObj = ({}).toString.call(f) === '[object Object]';
	
	if (isOptsObj) {
		var opts = f;
		var validOpts = opts.stream
			&& opts.size
			&& 'pause' in opts.stream
			&& !isNaN(+opts.size);
		var errTxt = '最初のパラメータはstreamとsizeを含むオブジェクトでなければなりません。';
		if (!validOpts) { cb(new Error(errTxt)); return; }
		
		self.f = opts.stream.path;
		self._compile(null, opts, cb);
		return;
	}

	self.f = f;
	fs.stat(f, function(err, fstats) {
		self._compile.call(self, err, fstats, cb);
	});
}

Mp3dat.prototype._compile = function(err, fstatsOpts, cb) {
	var self = this;
	self.size = fstatsOpts.size;
	self.stream = fstatsOpts.stream;
	
	self._findBitRate(function(err, bitrate) {
		if (err) { cb(err); return; }
		self._buildStats(cb);
	});
}

Mp3dat.prototype.spawnInstance = function() {
	return Mp3dat();
}

module.exports = Mp3dat();
