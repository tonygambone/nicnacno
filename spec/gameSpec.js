const Game = require('../src/game');

describe("Game", () => {
    it("should set a default first move", () => {
       var game = new Game();
       expect(game.nextMove).toBe('X'); 
    });
    
    it("should accept an optional first move", () => {
       var game = new Game('O');
       expect(game.nextMove).toBe('O');
       game = new Game('X');
       expect(game.nextMove).toBe('X');
    });
    
    it("should not accept invalid first moves", () => {
       expect(function() { new Game('Z'); }).toThrowError(/invalid initial move/i);
       expect(function() { new Game(1); }).toThrowError(/invalid initial move/i);
       expect(function() { new Game('x'); }).toThrowError(/invalid initial move/i);
       expect(function() { new Game('0'); }).toThrowError(/invalid initial move/i);
       expect(function() { new Game(0); }).toThrowError(/invalid initial move/i);
    });
    
    it("should have no initial result", () => {
        var game = new Game();
        expect(game.result).toBeUndefined(); 
    });
    
    (function() {
        var game = new Game();
        for (var i = 1; i < 9; i++) {
            (function(val) {
                it("should accept " + val + " as a valid move", () => {
                    expect(game.isValidMove(val)).toBeTruthy();
                });
            })(i);
        }
    })();
    
    (function() {
        var game = new Game();
        var moves = ['0', 0, false, 'X', 'O', 'zzz', 'true', 99, -100, 'false', true, 't', [1,2,3], {a: 'foo', b: 1}];
        for (var i = 0; i < moves.length; i++) {
            (function(val) {
                it("should not accept " + val + " as a valid move", () => {
                    expect(game.isValidMove(val)).toBeFalsy();
                });
            })(moves[i]);
        }
    })();
    
    it("should throw an exception on invalid move", () => {
        var game = new Game();
        expect(function(){game.applyMove('XXX');}).toThrowError(/invalid move/i);
    });
    
    it("should not accept moves after the game is complete", () => {
        var game = new Game();
        game.applyMove(1);
        game.applyMove(4);
        game.applyMove(2);
        game.applyMove(5);
        game.applyMove(3);
        expect(game.isValidMove(6)).toBeFalsy();
        expect(game.isValidMove(7)).toBeFalsy();
        expect(game.isValidMove(8)).toBeFalsy();
        expect(game.isValidMove(9)).toBeFalsy();
        expect(function(){ game.applyMove(6); }).toThrowError(/invalid move/i);
        expect(function(){ game.applyMove(7); }).toThrowError(/invalid move/i);
        expect(function(){ game.applyMove(8); }).toThrowError(/invalid move/i);
        expect(function(){ game.applyMove(9); }).toThrowError(/invalid move/i);
    });
    
    it("should return the result of the applied move", () => {
        var game = new Game();
        expect(game.applyMove(1)).toBeFalsy();
        expect(game.applyMove(4)).toBeFalsy();
        expect(game.applyMove(2)).toBeFalsy();
        expect(game.applyMove(5)).toBeFalsy();
        expect(game.applyMove(3)).toBeTruthy();
    });
    
    it("should set the result of a game won by X", () => {
        var game = new Game();
        game.applyMove(1);
        game.applyMove(4);
        game.applyMove(2);
        game.applyMove(5);
        game.applyMove(3);
        expect(game.result).toBe('X');
    });
    
    it("should set the result of a game won by O", () => {
        var game = new Game();
        game.applyMove(1);
        game.applyMove(4);
        game.applyMove(2);
        game.applyMove(5);
        game.applyMove(9);
        game.applyMove(6);
        expect(game.result).toBe('O');
    });
    
    it("should set the result of a draw", () => {
        var game = new Game();
        game.applyMove(1);
        game.applyMove(4);
        game.applyMove(2);
        game.applyMove(5);
        game.applyMove(6);
        game.applyMove(3);
        game.applyMove(7);
        game.applyMove(8);
        game.applyMove(9);
        expect(game.result).toBe('draw');
    });
    
    it("should emit the result event of a game won by X", (done) => {
        var game = new Game();        
        game.on('complete', (result) => {
            expect(result).toBe('X');
            done();
        });
        game.applyMove(1);
        game.applyMove(4);
        game.applyMove(2);
        game.applyMove(5);
        game.applyMove(3);
    });
    
    it("should emit the result event of a game won by O", (done) => {
        var game = new Game();        
        game.on('complete', (result) => {
            expect(result).toBe('O');
            done();
        });
        game.applyMove(1);
        game.applyMove(4);
        game.applyMove(2);
        game.applyMove(5);
        game.applyMove(9);
        game.applyMove(6);
    });
    
    it("should emit the result event of a draw", (done) => {
        var game = new Game();        
        game.on('complete', (result) => {
            expect(result).toBe('draw');
            done();
        });
        game.applyMove(1);
        game.applyMove(4);
        game.applyMove(2);
        game.applyMove(5);
        game.applyMove(6);
        game.applyMove(3);
        game.applyMove(7);
        game.applyMove(8);
        game.applyMove(9);
    });
    
    it("should not emit the complete event until complete", (done) => {
        var game = new Game();
        // pass spec automatically after a short wait
        setTimeout(done, 10);        
        game.on('complete', (result) => {
            done.fail('Complete event emitted');
        });
        game.applyMove(1);
        game.applyMove(4);
        game.applyMove(2);
    });
    
    it("should expose the next move to be applied", () => {
        var game = new Game();
        expect(game.nextMove).toBe('X');
        game.applyMove(1);
        expect(game.nextMove).toBe('O');
        game.applyMove(4);
        expect(game.nextMove).toBe('X');
        game.applyMove(2);
        expect(game.nextMove).toBe('O');
        game.applyMove(5);
        expect(game.nextMove).toBe('X');
    });
    
    (function() {
        var games = [
            { moves: [1,4,2,5,3], result: 'X' },
            { moves: [1,4,2,5,9,6], result: 'O' },
            { moves: [1,7,2,3,4,5], result: 'O' },
            { moves: [1,2,4,5,7], result: 'X' },
            { moves: [3,2,6,5,9], result: 'X' },
            { moves: [9,2,5,6,1], result: 'X' },
            { moves: [1,4,2,5,6,3,7,8,9], result: 'draw' }
        ];
        for (var i = 0; i < games.length; i++) {
            (function(val) {
                it("should run game " + val.moves + " => " + val.result + " properly", () => {
                    var game = new Game();
                    // all but last move
                    for (var i = 0; i < val.moves.length - 1; i++) {
                        var applyResult = game.applyMove(val.moves[i]);
                        expect(applyResult).toBeFalsy();
                        expect(game.result).toBeUndefined();
                    }
                    applyResult = game.applyMove(val.moves[val.moves.length - 1]);
                    expect(applyResult).toBeTruthy();
                    expect(game.result).toBe(val.result);
                });
            })(games[i]);
        }
    })();
});

