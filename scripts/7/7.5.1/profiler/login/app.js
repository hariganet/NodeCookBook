
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , flash = require('connect-flash');


var app = module.exports = express();
app.locals.compiler = require('./customJadeCompiler');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  // app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('koobkooCedoN'));
  app.use(express.session());
  app.use(express.csrf());
  app.use(require('stylus').middleware({
	  src: __dirname + '/views',
	  dest: __dirname + '/public'
  }));
  app.use(flash());
  app.use(require('./login'));
  app.use(function(req, res, next) {
	res.locals.user = req.session.user;
	res.locals.flash = req.flash();
	res.locals._csrf = req.session._csrf;
	next();
  });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});


app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/:pagenum([0-9]+)?', routes.index);
app.post('/:pagenum([0-9]+)?', routes.index);
app.del('/:pagenum([0-9]+)?', routes.index);
app.get('/del', routes.delprof);
app.post('/add', routes.addprof, routes.index);

if (!module.parent) {
	http.createServer(app).listen(app.get('port'), function(){
	  console.log("Express server listening on port " + app.get('port'));
	});
}

