'use strict';

const Game = require('./game');

class GameManager {
    constructor(xPlayer, oPlayer) {
        this.xPlayer = xPlayer || 'Alice';
        this.oPlayer = oPlayer || 'Bob';
        // needed for 'this' scoping, otherwise 'this' will be the game
        this._gameListener = (result) => { this._updateScore(result); };
        this.reset();
    }
    
    reset() {
        this._initGame(false);
        this.score = {
            X: 0,
            O: 0,
            draw: 0
        };
    }
    
    nextGame() {
        this._initGame(true);
    }
    
    _initGame(switchPlayer) {
        if (this.game) {
            this.game.removeListener('complete', this._gameListener);
        }
        var arg = switchPlayer ?
            (this._lastStartingPlayer == 'X' ? 'O' : 'X') :
            undefined;
        this.game = new Game(arg);        
        this.game.once('complete', this._gameListener);
        this._lastStartingPlayer = this.game.nextMove;
    }
    
    _updateScore(result) {
        this.score[result]++;
    }
}

module.exports = GameManager;
