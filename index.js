
const util = require('util'),
    colors = require('colors'),
    readline = require('readline');
    
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const newGame = {
    xPlayer: 'Alice',
    oPlayer: 'Bob',
    firstMove: 'X',
    nextMove: 'X',
    xWins: 0,
    oWins: 0,
    draws: 0,
    board: [
      [1,2,3],
      [4,5,6],
      [7,8,9]]
};

function printBoard(game) {
    console.log();
    for (var y = 0; y < 3; y++) {
        console.log(util.format(' %s \u2502 %s \u2502 %s ', 
          formatVal(game.board[y][0]),
          formatVal(game.board[y][1]),
          formatVal(game.board[y][2])));
        if (y < 2) {
            console.log('\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u253C\u2500\u2500\u2500');
        }
    }
}

function formatVal(val) {
    if (val == 'X') return val.green.bold;
    if (val == 'O') return val.yellow.bold;
    return val.toString().gray;    
}

function promptNames(game, cb) {
    rl.question('X player\'s name? ', (a) => {
        if (a != '') game.xPlayer = a;
        
        rl.question('O player\'s name? ', (a) => {
            if (a != '') game.oPlayer = a;
            
            if (cb) cb(game);
        });
    });
}

function gameLoop(game, cb) {
    printBoard(game);
    var nextPlayer = game.nextMove == 'X' ? game.xPlayer : game.oPlayer;
    rl.question(util.format('Your move, %s (%s): ', nextPlayer, formatVal(game.nextMove)), (a) => {
        if (!isValidMove(game, a)) {
            console.log('Invalid move!'.red);            
            gameLoop(game, cb);
        } else {
            var ai = parseInt(a);
            var x = (ai-1) % 3;
            var y = parseInt((ai-1) / 3);
            game.board[y][x] = game.nextMove;
            game.nextMove = game.nextMove == 'X' ? 'O' : 'X';
            
            if (isComplete(game)) {
                printBoard(game);
                switch (game.result) {
                    case 'X':
                        console.log(game.xPlayer + ' wins!'); break;
                    case 'O':
                        console.log(game.oPlayer + ' wins!'); break;
                    case 'draw':
                        console.log('It\'s a draw.'); break;
                }
                console.log('Score is %s: %d, %s: %d, draws: %d',
                    game.xPlayer, game.xWins, game.oPlayer, game.oWins, game.draws);
                askPlayAgain((a) => {
                    if (!a) {
                        if (cb) cb(game);
                        return;
                    } else {
                        game.board = JSON.parse(JSON.stringify(newGame.board));
                        game.nextMove = game.firstMove = game.firstMove == 'X' ? 'O' : 'X';
                        game.result = undefined;
                        gameLoop(game, cb);
                    }
                });
            } else {
                gameLoop(game, cb);
            }
        }
    });
}

function isValidMove(game, move) {
    return !isNaN(move) && [].concat.apply([], game.board).indexOf(parseInt(move)) != -1;
}

function isComplete(game) {
    for (var y = 0; y < 3; y++) {
        if (game.board[y][0] == game.board[y][1] && game.board[y][1] == game.board[y][2]) {
            game.result = game.board[y][0];
            game[(game.result == 'X' ? 'x' : 'o') + 'Wins']++;
            return true;
        }
    }
    
    for (var x = 0; x < 3; x++) {
        if (game.board[0][x] == game.board[1][x] && game.board[1][x] == game.board[2][x]) {
            game.result = game.board[0][x];
            game[(game.result == 'X' ? 'x' : 'o') + 'Wins']++;
            return true;
        }
    }
    
    if ((game.board[0][0] == game.board[1][1] && game.board[1][1] == game.board[2][2]) ||
        (game.board[0][2] == game.board[1][1] && game.board[1][1] == game.board[2][0])) {
        game.result = game.board[1][1];
        game[(game.result == 'X' ? 'x' : 'o') + 'Wins']++;
        return true;
    }
    
    if ([].concat.apply([], game.board).map((c,i) => {
        return isNaN(c);
    }).reduce((p,c) => { 
        return p && c; 
    }, true)) {
        game.result = 'draw';
        game.draws++;
        return true;
    }
    
    return false;
}

function askPlayAgain(cb) {
    rl.question('Play again? ', (a) => {
        a = a.toString().toLowerCase();
        if (['y','yes','yep'].indexOf(a) != -1)
            cb(true);
        else if (['n','no','nope'].indexOf(a) != -1)
            cb(false);
        else askPlayAgain(cb);
    });
}

function run() {    
    console.log('Welcome to nic-nac-no...');
    var game = JSON.parse(JSON.stringify(newGame));
    
    promptNames(game, function(game) {
        gameLoop(game, function(game) {
            rl.close();
        });
    });
}

run();