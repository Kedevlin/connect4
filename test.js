var Game = require('./game.js').Game;

// mock game
var generateCurrentGame = function(board, fillPosition, currentPlayer) {
    var game = new Game();
    game.board = board;
    game.fillPosition = fillPosition;
    game.currentPlayer = currentPlayer;
    game.numPlayers = 2;
    game.enoughPlayers = true;
    return game;
};

// check equality
var assertEquals = function(expected, actual, checkVariableName, testDescription) {
    if (expected === actual) {
        console.log("[success] verified " + checkVariableName + " with " + testDescription + ".");
    } else {
        console.log("[ERROR] failed to verify " + checkVariableName + " with " + testDescription + ".");
    }
};

// test game result
var checkGameResult = function(expectedsMap, game, rowPlayed, columnPlayed, testDescription) {

    var actualsMap = {};
    actualsMap.isGameOver = game.isGameOver(rowPlayed, columnPlayed);
    actualsMap.hasWinner = game.hasWinner(rowPlayed,columnPlayed);
    actualsMap.winner = game.winner;
    actualsMap.checkNoMoreSpots = game.hasNoMoreSpots();
    actualsMap.checkRow = game.checkRow(rowPlayed);
    actualsMap.checkColumn = game.checkColumn(columnPlayed);
    actualsMap.checkLeftDiagonal = game.checkLeftDiagonal(rowPlayed,columnPlayed);
    actualsMap.checkRightDiagonal = game.checkRightDiagonal(rowPlayed,columnPlayed);

    var expectsKeys = Object.keys(expectedsMap);

    for (var i = 0; i < expectsKeys.length; i++) {
        assertEquals(expectedsMap[expectsKeys[i]], actualsMap[expectsKeys[i]], expectsKeys[i], testDescription);
    }
};

// test bottom row win
var bottomRowWin = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,2,2,2,0,0,0],
    [1,1,1,1,2,0,0]
];

var game = generateCurrentGame(bottomRowWin, [4,3,3,3,4,4,4], 1);

var expected = {};
expected.isGameOver = true;
expected.hasWinner = true;
expected.winner = 1;
expected.checkNoMoreSpots = false;
expected.checkRow = true;
expected.checkColumn = false;
expected.checkLeftDiagonal = false;
expected.checkRightDiagonal = false;

checkGameResult(expected, game, 5, 0, 'bottom row win');

// test top row win + full board
var topRowWin = [
    [1,1,2,1,1,1,1],
    [2,2,1,2,2,2,1],
    [1,1,2,2,1,1,2],
    [2,2,2,1,2,2,1],
    [1,2,2,2,1,1,2],
    [2,1,1,1,2,2,1]
];

var game = generateCurrentGame(topRowWin, [-1,-1,-1,-1,-1,-1,-1], 1);

var expected = {};
expected.isGameOver = true;
expected.hasWinner = true;
expected.winner = 1;
expected.checkNoMoreSpots = true;
expected.checkRow = true;
expected.checkColumn = false;
expected.checkLeftDiagonal = false;
expected.checkRightDiagonal = false;

checkGameResult(expected, game, 0, 6, 'top row win');

// test right column win
var rightColumnWin = [
    [0,0,0,0,0,0,2],
    [0,0,0,0,0,0,2],
    [0,0,0,0,0,0,2],
    [0,0,0,0,0,0,2],
    [0,1,2,2,0,1,1],
    [1,2,1,1,2,1,1]
];

var game = generateCurrentGame(rightColumnWin, [4,3,3,3,4,3,-1], 2);

var expected = {};
expected.isGameOver = true;
expected.hasWinner = true;
expected.winner = 2;
expected.checkNoMoreSpots = false;
expected.checkRow = false;
expected.checkColumn = true;
expected.checkLeftDiagonal = false;
expected.checkRightDiagonal = false;

checkGameResult(expected, game, 0, 6, 'right column win');

// test left column win full board
var leftColumnFull = [
    [2,1,2,1,2,1,2],
    [2,1,1,2,2,2,1],
    [2,2,1,2,1,1,2],
    [2,1,1,2,2,1,1],
    [1,1,2,1,2,1,2],
    [1,2,1,2,1,2,1]
];

var game = generateCurrentGame(leftColumnFull, [-1,-1,-1,-1,-1,-1,-1], 2);

var expected = {};
expected.isGameOver = true;
expected.hasWinner = true;
expected.winner = 2;
expected.checkNoMoreSpots = true;
expected.checkRow = false;
expected.checkColumn = true;
expected.checkLeftDiagonal = false;
expected.checkRightDiagonal = false;

checkGameResult(expected, game, 0, 0, 'left column board full');

// test left diagonal win
var leftDiagonalWin = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,2],
    [0,0,0,1,0,2,2],
    [0,0,1,2,0,2,2],
    [0,1,2,2,2,1,1],
    [1,2,1,1,2,1,1]
];

var game = generateCurrentGame(leftDiagonalWin, [4,3,2,1,3,1,0], 1);

var expected = {};
expected.isGameOver = true;
expected.hasWinner = true;
expected.winner = 1;
expected.checkNoMoreSpots = false;
expected.checkRow = false;
expected.checkColumn = false;
expected.checkLeftDiagonal = true;
expected.checkRightDiagonal = false;

checkGameResult(expected, game, 4, 1, 'left diagonal win');

// test left diagonal win full board
var leftDiagonalFull = [
    [2,2,2,1,2,2,1],
    [2,1,1,2,2,2,1],
    [2,1,1,2,1,1,2],
    [1,2,1,1,2,1,2],
    [1,1,2,2,1,1,2],
    [1,2,1,2,1,2,1]
];

var game = generateCurrentGame(leftDiagonalFull, [-1,-1,-1,-1,-1,-1,-1], 1);

var expected = {};
expected.isGameOver = true;
expected.hasWinner = true;
expected.winner = 1;
expected.checkNoMoreSpots = true;
expected.checkRow = false;
expected.checkColumn = false;
expected.checkLeftDiagonal = true;
expected.checkRightDiagonal = false;

checkGameResult(expected, game, 0, 3, 'left diagonal win full board');

// test right diagonal win
var rightDiagonalWin = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,2],
    [0,0,0,1,0,0,2],
    [0,0,0,2,1,2,2],
    [0,1,2,2,2,1,1],
    [1,2,1,1,2,1,1]
];

var game = generateCurrentGame(rightDiagonalWin, [4,3,3,1,2,2,0], 1);

var expected = {};
expected.isGameOver = true;
expected.hasWinner = true;
expected.winner = 1;
expected.checkNoMoreSpots = false;
expected.checkRow = false;
expected.checkColumn = false;
expected.checkLeftDiagonal = false;
expected.checkRightDiagonal = true;

checkGameResult(expected, game, 2, 3, 'right diagonal win');

// test right diagonal win full board
var rightDiagonalFull = [
    [1,1,2,2,2,1,2],
    [1,2,1,2,2,2,1],
    [2,1,2,2,1,2,2],
    [2,1,2,1,2,1,2],
    [1,1,2,1,1,1,2],
    [1,2,1,2,1,2,1]
];

var game = generateCurrentGame(rightDiagonalFull, [-1,-1,-1,-1,-1,-1,-1], 2);

var expected = {};
expected.isGameOver = true;
expected.hasWinner = true;
expected.winner = 2;
expected.checkNoMoreSpots = true;
expected.checkRow = false;
expected.checkColumn = false;
expected.checkLeftDiagonal = false;
expected.checkRightDiagonal = true;

checkGameResult(expected, game, 0, 3, 'right diagonal win full board');

// test right diagonal win off board not full place final piece in middle
var rightDiagonalFull = [
    [1,0,0,0,0,1,0],
    [1,0,1,2,0,2,0],
    [2,0,1,2,2,1,0],
    [2,1,2,1,2,2,2],
    [1,1,2,1,1,1,2],
    [1,2,1,2,1,2,1]
];

var game = generateCurrentGame(rightDiagonalFull, [-1,2,0,0,1,-1,2], 2);

var expected = {};
expected.isGameOver = true;
expected.hasWinner = true;
expected.winner = 2;
expected.checkNoMoreSpots = false;
expected.checkRow = false;
expected.checkColumn = false;
expected.checkLeftDiagonal = false;
expected.checkRightDiagonal = true;

checkGameResult(expected, game, 2, 4, 'right diagonal win off board not full, place final piece in middle');

// test full board no win
var fullBoardNoWin = [
    [1,1,2,2,2,1,2],
    [1,2,1,2,2,2,1],
    [2,1,2,2,1,1,2],
    [2,1,2,1,2,1,2],
    [1,1,2,1,1,1,2],
    [1,2,1,2,1,2,1]
];

var game = generateCurrentGame(fullBoardNoWin, [-1,-1,-1,-1,-1,-1,-1], 2);

var expected = {};
expected.isGameOver = true;
expected.hasWinner = false;
expected.winner = null;
expected.checkNoMoreSpots = true;
expected.checkRow = false;
expected.checkColumn = false;
expected.checkLeftDiagonal = false;
expected.checkRightDiagonal = false;

checkGameResult(expected, game, 0, 6, 'full board no win');
