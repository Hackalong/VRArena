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

Player = function(playerNum0, xCoord0, yCoord0, zCoord0, xRot0, yRot0, zRot0){
	this.playerNum = playerNum0;
	this.xCoord = xCoord0;
	this.yCoord = yCoord0;
	this.zCoord = zCoord0;
	this.xRot = xRot0;
	this.yRot = yRot0;
	this.zRot = zRot0;
};

var players = [];

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

	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});

	socket.on('move', function(player){
		pNum = player[0];
   	players[pNum].xCoord = player[1];
		players[pNum].yCoord = player[2];
		players[pNum].zCoord = player[3];
		players[pNum].xRot = player[4];
		players[pNum].yRot = player[5];
		players[pNum].zRot = player[6];
	});

  console.log('users connected: ' + numPlayers);
	io.emit('connect', numPlayers);
	console.log("connect");

	socket.on('playerNum', function(temp){
		io.emit('playerNum', numPlayers);
		players.push(new Player(numPlayers, 0, 0, 0, 0, 0, 0, 0));
		++numPlayers;
	});

	socket.on('disconnect', function(){
		console.log("disconnect");
	});

  /*socket.on('disconnect', function(){
      --numPlayers;
       console.log('users connected: ' + numPlayers);
       io.emit('connect', numPlayers);
  });*/

	var intervalID = setInterval(function(){
		//console.log(players[0].xCoord);
		//console.log(players[0].zCoord);
		var data = players;
		io.emit('update', data)
	;}, 33);

});

http.listen(3001, function(){
	console.log('listening on *:3001');
});
