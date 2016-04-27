const GameManager = require('../src/gameManager');

describe("GameManager", () => {
    it("should populate default player names", () => {
        var mgr = new GameManager();
        expect(mgr.xPlayer).toBe('Alice');
        expect(mgr.oPlayer).toBe('Bob');        
    });
    
    it("should accept custom player names", () => {
        var mgr = new GameManager('Foo', 'Bar');
        expect(mgr.xPlayer).toBe('Foo');
        expect(mgr.oPlayer).toBe('Bar');        
    });
    
    it("should start a new game when created", () => {
        var mgr = new GameManager();
        expect(mgr.game).toBeDefined();
    });
    
    it("should allow resetting to the initial game state", () => {
        var mgr = new GameManager();
        expect(mgr.game.nextMove).toBe('X');
        mgr.game.applyMove(1);
        expect(mgr.game.nextMove).toBe('O');
        
        mgr.reset();
        expect(mgr.game.nextMove).toBe('X');
    });
    
    it("should allow moving to the next game where the starting player is switched", () => {
        var mgr = new GameManager();
        expect(mgr.game.nextMove).toBe('X');
        mgr.game.applyMove(1);
        expect(mgr.game.nextMove).toBe('O');
        
        mgr.nextGame();
        expect(mgr.game.nextMove).toBe('O');
        mgr.game.applyMove(1);
        expect(mgr.game.nextMove).toBe('X');
        
        mgr.nextGame();
        expect(mgr.game.nextMove).toBe('X');
    });
    
    it("should update the score when a game completes", () => {
        var mgr = new GameManager();
        expect(mgr.score.X).toBe(0);
        expect(mgr.score.O).toBe(0);
        expect(mgr.score.draw).toBe(0);
        
        mgr.game.applyMove(1);
        mgr.game.applyMove(4);
        mgr.game.applyMove(2);
        mgr.game.applyMove(5);
        mgr.game.applyMove(3);
        expect(mgr.score.X).toBe(1);
        expect(mgr.score.O).toBe(0);
        expect(mgr.score.draw).toBe(0);
        
        mgr.nextGame(); // O now starts
        mgr.game.applyMove(1);
        mgr.game.applyMove(4);
        mgr.game.applyMove(2);
        mgr.game.applyMove(5);
        mgr.game.applyMove(3);
        expect(mgr.score.X).toBe(1);
        expect(mgr.score.O).toBe(1);
        expect(mgr.score.draw).toBe(0);
        
        mgr.nextGame(); // X now starts
        mgr.game.applyMove(1);
        mgr.game.applyMove(4);
        mgr.game.applyMove(2);
        mgr.game.applyMove(5);
        mgr.game.applyMove(6);
        mgr.game.applyMove(3);
        mgr.game.applyMove(7);
        mgr.game.applyMove(8);
        mgr.game.applyMove(9);
        expect(mgr.score.X).toBe(1);
        expect(mgr.score.O).toBe(1);
        expect(mgr.score.draw).toBe(1);        
    });
});