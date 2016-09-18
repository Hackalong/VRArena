var socket = io();
var playerNum = 0;

socket.on('playerNum', function(data){
  console.log("data showing: " + data);
  playerNum = data;
});

socket.emit('playerNum', playerNum);

$('#f1').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});

// $('#f2').submit(function(){
//   socket.emit('move', $('#m1').val());
//   $('#m1').val('');
//   return false;
// });

socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
});

socket.on('update', function(data){
  console.log(data);
});
