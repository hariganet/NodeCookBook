var http = require('http');
var parser = new (require('xml2js')).Parser({
	trim: true,
	explicitArray: false
});
var colors = require('colors'); // コンソール出力をフォーマットします
var trendingTopics = require('./twitter_trends'); // trendingTopicsオブジェクトを呼び出します

var hotTrends = Object.create(trendingTopics,
	{
		trends: {value: {
			urlOpts: {
				host: 'www.google.com',
				path: '/trends/hottrends/atom/hourly',
				headers: {'User-Agent': ''}
			}
		}
	}
});

hotTrends.xmlHandler = function(res, cb) {
	var hotTrendsFeed = '';
	res.on('data', function(chunk){
		hotTrendsFeed += chunk;
	}).on('end', function(){
		parser.parseString(hotTrendsFeed, function(err, obj) {
			if(err) { throw(err.message); }
			parser.parseString(obj.feed.entry.content['_'], function(err, obj){
				if(err) { throw(err.message); }
				cb(encodeURIComponent(obj.ol.li[0].span.a['_']));
			});
		})
	})
}

function makeCall(urlOpts, handler, cb) {
	http.get(urlOpts, function (res) {
		handler(res, cb);
	}).on('error', function (e) {
		console.log("接続エラー：" + e.message);
	});
}

makeCall(hotTrends.trends.urlOpts, hotTrends.xmlHandler, function (query) {
	hotTrends.tweetPath(query);
	makeCall(hotTrends.tweets.urlOpts, hotTrends.jsonHandler, function (tweetsObj) {
		tweetsObj.results.forEach(function (tweet) {
			console.log("\n" + tweet.from_user.yellow.bold + ': ' + tweet.text);
		});
	});
});