var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io').listen(http);

var numPlayers = 0;

Player = function(playerNumber0, xCoord0, yCoord0, zCoord0, rot0){
	this.playerNumber = playerNumber0;
	this.xCoord = xCoord0;
	this.yCoord = yCoord0;
	this.zCoord = zCoord0;
	this.rot = rot0;
};

Projectile = function(xCoord0, yCoord0, zCoord0, vector0){
	this.xCoord = xCoord0;
	this.yCoord = yCoord0;
	this.zCoord = zCoord0;
	this.vector = vector0;
};

var players = [];
var projectiles = [];

/*var data = { items: [
	playerPositions: players
	projectilePositions: projectiles
]};*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

io.on('connection', function(socket){
	players.push(new Player(0, 1, 2, 3, 4));

	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});
	
	socket.on('update', function(position){
        io.emit('update', position);
    }); 
	
	socket.on('shoot', function(position){
        io.emit('shoot', positionAnd);
    	projectiles.push(new Projectile(0, 0, 0, 0));
	}); 
      
    ++numPlayers;
    console.log('users connected: ' + numPlayers);
    io.emit('connect', numPlayers);
    socket.on('disconnect', function(){
        --numPlayers;
        console.log('users connected: ' + numPlayers);
        io.emit('connect', numPlayers);
    });

	var intervalID = setInterval(function(){
		//console.log(players[0].xCoord);
		//console.log(players[0].zCoord);
		//io.emit('chat message', players[0].xCoord);
	}, 1000);

});

http.listen(3001, function(){
	console.log('listening on *:3001');
});




