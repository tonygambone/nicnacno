'use strict';

const util = require('util'),
    colors = require('colors'),
    readline = require('readline'),
    GameManager = require('./gameManager');
    
class ConsoleGameRunner {
    constructor() {
        this._rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this._gm = new GameManager();
    }
    
    run() {    
        console.log('Welcome to nic-nac-no...');
        
        this._promptNames(() => {
            this._gameLoop(() => {
                this._rl.close();
            });
        });
    }
    
    _promptNames(cb) {
        this._rl.question('X player\'s name? ', (a) => {
            if (a !== '') this._gm.xPlayer = a;
            
            this._rl.question('O player\'s name? ', (a) => {
                if (a !== '') this._gm.oPlayer = a;
                
                if (cb) cb();
            });
        });
    }
    
    _formatVal(val) {
        if (val == 'X') return val.green.bold;
        if (val == 'O') return val.yellow.bold;
        return val.toString().gray;    
    }
    
    _gameLoop(cb) {
        this._printBoard();
        var gm = this._gm;
        var game = gm.game;
        var nextPlayer = game.nextMove == 'X' ? gm.xPlayer : gm.oPlayer;
        this._rl.question(util.format('Your move, %s (%s): ', nextPlayer, this._formatVal(game.nextMove)), (a) => {
            if (!game.isValidMove(a)) {
                console.log('Invalid move!'.red);            
                this._gameLoop(cb);
            } else {
                var result = game.applyMove(a);                
                if (result) {
                    this._printBoard(game);
                    switch (game.result) {
                        case 'X':
                            console.log(gm.xPlayer + ' wins!'); break;
                        case 'O':
                            console.log(gm.oPlayer + ' wins!'); break;
                        case 'draw':
                            console.log('It\'s a draw.'); break;
                    }
                    console.log('Score is %s: %d, %s: %d, draws: %d',
                        gm.xPlayer, gm.score.X, gm.oPlayer, gm.score.O, gm.score.draw);
                    this._askPlayAgain((a) => {
                        if (!a) {
                            if (cb) cb();
                        } else {
                            gm.nextGame();
                            this._gameLoop(cb);
                        }
                    });
                } else {
                    this._gameLoop(cb);
                }
            }
        });
    }
    
    _askPlayAgain(cb) {
        this._rl.question('Play again? ', (a) => {
            a = a.toString().toLowerCase();
            if (['y','yes','yep'].indexOf(a) != -1)
                cb(true);
            else if (['n','no','nope'].indexOf(a) != -1)
                cb(false);
            else this._askPlayAgain(cb);
        });
    }
        
    _printBoard() {
        console.log();
        for (var y = 0; y < 3; y++) {
            console.log(util.format(' %s \u2502 %s \u2502 %s ', 
            this._formatVal(this._gm.game.board[y][0]),
            this._formatVal(this._gm.game.board[y][1]),
            this._formatVal(this._gm.game.board[y][2])));
            if (y < 2) {
                console.log('\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u253C\u2500\u2500\u2500');
            }
        }
    }
}

module.exports = ConsoleGameRunner;
