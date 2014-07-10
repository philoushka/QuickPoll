
var express = require('express')
  , http = require('http')
  , nconf = require('nconf')
  , path = require('path')
  , azure =  require('azure-storage')
  , bodyParser = require('body-parser')
  ;

// CONFIGURATION
nconf.env().file({ file: 'settings.json' });

var app = express();
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('azure zomg'));
    app.use(express.session());    
    app.use(app.router);
    app.use(require('less-middleware')({ src: __dirname + '/public' }));
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(express.json()); 

//ROUTING
require('./routes/home')(app);
require('./routes/tally')(app);

var server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
 