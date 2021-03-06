var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({
	  src: __dirname + '/views',
	  dest: __dirname + '/public'
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/admin', require('./login/app'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/:pagenum([0-9]+)?', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
