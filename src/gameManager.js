'use strict';

const Game = require('./game');

class GameManager {
    constructor(xPlayer, oPlayer) {
        this.xPlayer = xPlayer || 'Alice';
        this.oPlayer = oPlayer || 'Bob';
        
        var _updateScore = (result) => {
            this.score[result]++;
        };
        var _lastStartingPlayer = null;
        var _initGame = (switchPlayer) => {
            if (this.game) {
                this.game.removeListener('complete', _updateScore);
            }
            var arg = switchPlayer ?
                (_lastStartingPlayer == 'X' ? 'O' : 'X') :
                undefined;
            this.game = new Game(arg);
            this.game.once('complete', _updateScore);
            _lastStartingPlayer = this.game.nextMove;
        };
        
        this.reset = () => {
            _initGame(false);
            this.score = {
                X: 0,
                O: 0,
                draw: 0
            };
        };
        
        this.nextGame = () => {
            _initGame(true);
        };
        
        this.reset();
    }
}

module.exports = GameManager;
