var csv = require('ya-csv');
var writer = csv.createCsvFileWriter ('data.csv', {
	'separator': ':',
	'quote': '|',
	'escape': '\\' // バックスラッシュはエスケープされるので、実際のescapeはバックスラッシュ一文字です。
})

var data = [['a','b','c','d','e|','f','g'],['h','i','j','k','l','m','n']];

data.forEach(function(rec){
	writer.writeRecord(rec);
});
