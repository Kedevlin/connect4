var restify = require('restify');
var socketio = require('socket.io');
var fs = require('fs');
var Game = require('./game.js').Game;

var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'Connect4'});

var server = restify.createServer({log: log});
server.use(restify.requestLogger());

var io = socketio.listen(server.server);

server.listen(8080, function () {
    log.info('server listening at %s', server.url);
});

var game = new Game();

// routes
server.get('/getid/', function (req, res, next) {
    req.log.info('Get id request initiated.');
    if (!game.enoughPlayers) {
        var id = generateId();
        req.log.info({'playedId': id}, 'Id generated for player: ' + id + ', will redirect to /game/' + id + ' route');
        res.redirect('http://localhost:8080/game/' + id, next);
    } else {
        req.log.info('Get id request with max players already reached, will redirect to root route');
        res.redirect('http://localhost:8080/', next);
    }
});

server.get('game/:id', function indexHTML(req, res, next) {
    req.log.info({'playedId': req.params.id}, 'Get request to /game/' + req.params.id + ' initiated.');
    fs.readFile(__dirname + '/client/index.html', function (err, data) {
        if (err) {
            req.log.error({err: err}, "Failed to open /client/index.html");
            next(err);
            return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(data);
        next();
    });
});

server.get(/.*/, restify.serveStatic({
    'directory': './client',
    'default': 'welcome.html'
}));

// event listeners
io.sockets.on('connect_error', function(err) {
    log.error({err: err}, 'Socket connection error.');
});

io.sockets.on('connection', function (socket) {
    log.info({socketId: socket.id}, 'Socket connected.');
    socket.on('error', function (err) {
        log.error({err: err, socketId: socket.id}, "Failed to connect to server.");
    });
    buildBoard(socket);
    socket.on('column click', function(data) { handleColumnClick(socket, data); });
    socket.on('new game', function () { handleNewGame(socket); });
});

var handleColumnClick = function(socket, data) {
    log.info({socketId: socket.id}, 'Handling column click for colum: ' + data.column + ', by player: ' + data.playerId);

    if (!game.gameOver && (parseInt(data.playerId) === game.currentPlayer)) {
        log.info({socketId: socket.id}, 'Confirmed game is not over and it is player\'s turn. Attempting to place tile.');

        var player = game.currentPlayer;
        var column = parseInt(data.column);
        var row = game.playTurn(column);
        if (row >= 0) {
            log.info({socketId: socket.id}, 'Clicked column is not full, placing tile for player ' + player + ' at row ' + row + ' and column ' + column);
            io.sockets.emit('fill tile', {row: row, column: column, player: player});

            if (game.isGameOver(row, column)) {
                var winner = game.winner;
                log.info({socketId: socket.id}, 'Game is over, winner: ' + winner);
                io.sockets.emit('game over', { winner: winner });
            } else {
                log.info({socketId: socket.id}, 'Game is not over, end of player ' + player + '\'s turn.');
                game.switchCurentPlayer();
            }
        }
    }
};

var handleNewGame = function(socket) {
    log.info({socketId: socket.id}, 'Handling new game request.');
    game = new Game();
    io.sockets.emit('go home');
};

// helper methods
var generateId = function() {
    game.numPlayers++;
    if (game.numPlayers === 2) { game.enoughPlayers = true; }
    return game.numPlayers;
};

var buildBoard = function(socket) {
    log.info({socketId: socket.id}, 'Building game board.');
    if (game.gameOver) {
        log.info({socketId: socket.id}, 'Game is over, winner: ' + game.winner);
        socket.emit('game over', { winner: game.winner });
    }

    for(var row = 0; row < game.board.length; row++) {
        for(var column = 0; column < game.board[row].length; column++){
            var player = game.board[row][column];
            if (player !== 0) { log.info({socketId: socket.id}, 'Placing tile for player ' + player + ' at row ' + row + ' and column ' + column); }
            socket.emit('fill tile', {row: row, column: column, player: player});
        }
    }
    log.info({socketId: socket.id}, 'Game board built.');
};
