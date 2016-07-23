module.exports.Game = Game;
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'Connect4', level: 'debug'});

function Game() {
	this.board = [
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0]
	];
	this.fillPosition = [5,5,5,5,5,5,5];
	this.MAX_ROW_NUM = 5;
	this.MAX_COLUMN_NUM = 6;
	this.currentPlayer = 1;
	this.winner = null;
	this.gameOver = false;
	this.numPlayers = 0;
	this.enoughPlayers = false;
	log.debug('Instantiated a new game.');
}

Game.prototype.playTurn = function(column) {
	if (this.fillPosition[column] === -1) {
		log.debug('Column is full, not a valid play. ');
		return -1;
	} else{
		var row = this.fillPosition[column];
		this.fillPosition[column] = this.fillPosition[column] - 1;
		this.board[row][column] = this.currentPlayer;
		return row;
	}
};

Game.prototype.switchCurentPlayer = function() {
	if (this.currentPlayer === 1) {
		this.currentPlayer = 2;
	} else {
		this.currentPlayer = 1;
	}
	log.debug('Switched current player to player ' + this.currentPlayer);
};

Game.prototype.isGameOver = function(row, column) {
	return this.hasWinner(row, column) || this.hasNoMoreSpots();
};

Game.prototype.hasWinner = function(row, column) {
	log.debug('Checking to see if player ' + this.currentPlayer + ' won the game.');
	if (this.checkRow(row) || this.checkColumn(column) ||
	this.checkLeftDiagonal(row, column) || this.checkRightDiagonal(row, column)) {
		this.winner = this.currentPlayer;
		this.gameOver = true;
		log.debug('Player ' + this.winner + ' has won the game.');
		return true;
	} else {
		log.debug('No winner.');
		return false;
	}
};

Game.prototype.hasNoMoreSpots = function() {
	log.debug('Checking for open spots.');
	for (var i = 0; i < this.fillPosition.length; i++) {
		if (this.fillPosition[i] != -1) {
			log.debug('Open spots found on the board.');
			return false;
		}
	}
	this.gameOver = true;
	log.debug('No more spots on the board.');
	return true;
};

Game.prototype.isValidCell = function(row, column) {
	return (column >= 0) &&	(column <= this.MAX_COLUMN_NUM) && (row >= 0) &&
	(row <= this.MAX_ROW_NUM);
};

Game.prototype.isCellCurrentPlayer = function(row, column) {
	return this.board[row][column] === this.currentPlayer;
};

Game.prototype.checkRow = function(row) {
	var currentColumn = 0;
	log.debug('Checking for a win in row ' + row + '. Starting column: ' + currentColumn);
	var count;
	while(this.isValidCell(row, currentColumn)) {
		if (this.isCellCurrentPlayer(row, currentColumn)) {
			count = 0;
			while (this.isValidCell(row, currentColumn) &&
						 this.isCellCurrentPlayer(row, currentColumn)) {
				count++;
				currentColumn++;
				if (count === 4) {
					log.debug('Row win found.');
					return true;
				}
			}
		} else {
			currentColumn++;
		}
	}
	log.debug('Row win not found.');
	return false;
};

Game.prototype.checkColumn = function(column) {
	var currentRow = this.MAX_ROW_NUM;
	log.debug('Checking for a win in column ' + column + '. Starting row: ' + currentRow);
	var count;
	while(this.isValidCell(currentRow, column)) {
		if (this.isCellCurrentPlayer(currentRow, column)) {
			count = 0;
			while (this.isValidCell(currentRow, column) &&
						 this.isCellCurrentPlayer(currentRow, column)) {
				count++;
				currentRow--;
				if (count === 4) {
					log.debug('Column win found.');
					return true;
				}
			}
		} else {
			currentRow--;
		}
	}
	log.debug('Column win not found.');
	return false;
};

Game.prototype.findLeftEdge = function(row, column) {
	var rowEdge = row;
	var columnEdge = column;
	while (this.isValidCell(rowEdge + 1, columnEdge - 1)) {
		rowEdge++;
		columnEdge--;
	}
	return {
		rowEdge: rowEdge,
		columnEdge: columnEdge
	};
};

Game.prototype.checkLeftDiagonal = function(row, column) {
	var leftEdge = this.findLeftEdge(row, column);
	var currentRow = leftEdge.rowEdge;
	var currentColumn = leftEdge.columnEdge;
	log.debug('Checking for a left diagonal win.' + ' Starting row: ' + currentRow + ', starting column: ' + currentColumn);
	var count;
	while(this.isValidCell(currentRow, currentColumn)) {
		if (this.isCellCurrentPlayer(currentRow, currentColumn)) {
			count = 0;
			while (this.isValidCell(currentRow, currentColumn) &&
						 this.isCellCurrentPlayer(currentRow, currentColumn)) {
				count++;
				currentRow--;
				currentColumn++;
				if (count === 4) {
					log.debug('Left diagonal win found.');
					return true;
				}
			}
		} else {
			currentRow--;
			currentColumn++;
		}
	}
	log.debug('Left diagonal win not found.');
	return false;
};

Game.prototype.findRightEdge = function(row, column) {
	var rowEdge = row;
	var columnEdge = column;
	while (this.isValidCell(rowEdge + 1, columnEdge + 1)) {
		rowEdge++;
		columnEdge++;
	}
	return {
		rowEdge: rowEdge,
		columnEdge: columnEdge
	};
};

Game.prototype.checkRightDiagonal = function(row, column) {
	var rightEdge = this.findRightEdge(row, column);
	var currentRow = rightEdge.rowEdge;
	var currentColumn = rightEdge.columnEdge;
	log.debug('Checking for a right diagonal win.' + ' Starting row: ' + currentRow + ', starting column: ' + currentColumn);
	var count;
	while(this.isValidCell(currentRow, currentColumn)) {
		if (this.isCellCurrentPlayer(currentRow, currentColumn)) {
			count = 0;
			while (this.isValidCell(currentRow, currentColumn) &&
						 this.isCellCurrentPlayer(currentRow, currentColumn)) {
				count++;
				currentRow--;
				currentColumn--;
				if (count === 4) {
					log.debug('Right diagonal win found.');
					return true;
				}
			}
		} else {
			currentRow--;
			currentColumn--;
		}
	}
	log.debug('Right diagonal win not found.');
	return false;
};
