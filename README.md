# nicnacno

A console-based tic-tac-toe game written in Javascript for [nodejs](https://nodejs.org).

Run it directly:

```
$ npm install -g nicnacno
$ nicnacno
Welcome to nic-nac-no...
X player's name? Alice
O player's name? Bob

 1 │ 2 │ 3
───┼───┼───
 4 │ 5 │ 6
───┼───┼───
 7 │ 8 │ 9
Your move, Alice (X):
```

Or use it like a library:

```
$ npm install --save nicnacno
```

```javascript
// the game manager allows multiple consecutive games
// and keeps score between the players
const GameManager = require('nicnacno');

// first player is X, second player is O
var gameManager = new GameManager('Alice', 'Bob');

// moves are 1-9, top left to bottom right
gameManager.game.applyMove(1); // X
gameManager.game.nextMove == 'O'; // true
gameManager.game.applyMove(3); // O
gameManager.game.nextMove == 'X'; // true
gameManager.game.applyMove(7); // X
gameManager.game.applyMove(4); // O
gameManager.game.isValidMove(4); // false, already occupied
gameManager.game.isValidMove(9); // true
gameManager.game.applyMove(9); // X
gameManager.game.applyMove(5); // O
gameManager.game.applyMove(8); // X wins, applyMove returns true

// check results
gameManager.game.result == 'X'; // could be undefined, 'X', 'O', or 'draw'
gameManager.score.X == 1;
gameManager.score.O == 0;
gameManager.score.draw == 0;

gameManager.nextGame(); // game resets, now O goes first
gameManager.reset() // reset to initial state, clearing score and initial player
```


