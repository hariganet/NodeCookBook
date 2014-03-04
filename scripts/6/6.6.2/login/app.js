
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , flash = require('connect-flash');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('koobkooCedoN'));
  app.use(express.session());
  app.use(flash());
  app.use(require('./login'));
  app.use(function(req, res, next) {
	res.locals.user = req.session.user;
	res.locals.flash = req.flash();
	next();
  });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/', routes.index); // 変更
app.del('/', routes.index); // 変更
app.get('/:page', routes.index); // 追加


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
