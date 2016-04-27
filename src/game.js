'use strict';

const EventEmitter = require('events');

class Game extends EventEmitter {
    
    constructor(initialMove) {
        if (initialMove !== undefined &&
            ['X','O'].indexOf(initialMove) == -1) throw new Error("Invalid initial move. Must be X or O");
        super();
        this.result = undefined;
        this.board = [
            [1,2,3],
            [4,5,6],
            [7,8,9]];
            
        var _nextMove = initialMove || 'X';
        var _toggleNextMove = () => {
            _nextMove = _nextMove == 'X' ? 'O' : 'X';
        };
        var _checkComplete = () => {
            for (var y = 0; y < 3; y++) {
                if (this.board[y][0] == this.board[y][1] && this.board[y][1] == this.board[y][2]) {
                    this.result = this.board[y][0];
                    this.emit('complete', this.result);
                    return true;
                }
            }
            
            for (var x = 0; x < 3; x++) {
                if (this.board[0][x] == this.board[1][x] && this.board[1][x] == this.board[2][x]) {
                    this.result = this.board[0][x];
                    this.emit('complete', this.result);
                    return true;
                }
            }
            
            if ((this.board[0][0] == this.board[1][1] && this.board[1][1] == this.board[2][2]) ||
                (this.board[0][2] == this.board[1][1] && this.board[1][1] == this.board[2][0])) {
                this.result = this.board[1][1];
                this.emit('complete', this.result);
                return true;
            }
            
            if ([].concat.apply([], this.board).map((c,i) => {
                return isNaN(c);
            }).reduce((p,c) => { 
                return p && c; 
            }, true)) {
                this.result = 'draw';
                this.emit('complete', this.result);
                return true;
            }
            
            return false;
        };
        
        this.applyMove = (move) => {
            if (!this.isValidMove(move)) {
                throw new Error("Invalid move");
            }
            var ai = parseInt(move);
            var x = (ai-1) % 3;
            var y = parseInt((ai-1) / 3);
            this.board[y][x] = _nextMove;
            _toggleNextMove();
            _checkComplete();
            return !!this.result;
        };
        
        Object.defineProperty(this, 'nextMove', { get: function () { return _nextMove; }, enumerable: true });
    }
    
    //get nextMove() { return this._nextMove; }
    
    isValidMove(move) {
        if (this.result) return false;
        return !isNaN(move) && [].concat.apply([], this.board).indexOf(parseInt(move)) != -1;
    }
}

module.exports = Game;