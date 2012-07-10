var express         = require('express')
  , app             = module.exports = express.createServer();
  
var PORT = process.env.PORT || 3000;

// Express Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/', require('./routes/index'));
app.get('/render.:format', require('./routes/render'));
app.post('/render.:format', require('./routes/render'));


app.listen(PORT, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});