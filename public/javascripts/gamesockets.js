var socket = io();
var playerNum = -1;

socket.on('playerNum', function(data){
  console.log("data showing: " + data);
  if (playerNum === -1) {
    playerNum = data;
  }
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
  players = data;
});
