var socket = io.connect('http://localhost:8080');

var path = window.location.pathname;
var n = path.lastIndexOf('/');
var id = path.substring(n + 1);

// click handlers
$('th').click(function(event) {
  var column = event.target.dataset.column;
  socket.emit('column click', {column: column, playerId: id });
});

// event listeners
socket.on('fill tile', function(data) {
  var player = data.player;
  var selector = '#row-' + data.row + ' .column-' + data.column;
  if (player === 0) {
    $(selector).removeClass('filled-1');
    $(selector).removeClass('filled-2');
  } else {
    $(selector).addClass('filled-' + player);
  }
});

socket.on('game over', function(data) {
  var winner = data.winner;
  if (winner === null) {
    result = ' - it\'s a draw!';
  } else if (winner === parseInt(id)) {
    result = ' - you win!';
  } else {
    result = ' - you lose!';
  }
  $('body').prepend($('<h5>Game Over' + result + '</h5>'));
  $('body').prepend($('<input type="button" id="new-game" value="NEW GAME"/>'));
});

$('body').on( 'click', '#new-game', function() {
  socket.emit('new game');
});

socket.on('go home', function() {
  window.location = 'http://localhost:8080/';
});
