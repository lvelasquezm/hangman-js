const assert = require('chai').assert;
const HangmanGame = require('./hangman');

describe('hangman-game', () => {

  it('creates a new game', () => {
    return HangmanGame.createNew().then(game => {
      assert.equal(game.word.length, game.progress.length);
      assert.match(game.progress, /^[ _ ]+$/);
    });
  })

  it('guesses first letter correctly', () => {
    let game = new HangmanGame('_______', 0, 'customs');
    assert.isTrue(game.guess('c'));
    assert.equal('c______', game.progress);
    assert.equal(0, game.fails);
  });

  it('guesses multiple letters correctly', () => {
    let game = new HangmanGame('_______', 0, 'customs');
    assert.isTrue(game.guess('s'));
    assert.equal('__s___s', game.progress);
    assert.equal(0, game.fails);
  });

  it('handles bad guesses', () => {
    let game = new HangmanGame('_______', 0, 'customs');
    assert.isFalse(game.guess('a'));
    assert.equal('_______', game.progress);
    assert.equal(1, game.fails);
  });

  it('wins the game', () => {
    let game = new HangmanGame('___', 0, 'win');
    
    assert.isTrue(game.guess('w'));
    assert.equal('w__', game.progress);
    assert.equal(0, game.fails);

    assert.isTrue(game.guess('n'));
    assert.equal('w_n', game.progress);
    assert.equal(0, game.fails);

    assert.isTrue(game.guess('i'));
    assert.equal(game.word, game.progress);
    assert.equal(0, game.fails);

    assert.isTrue(game.hasWon);
  });

  it('loses the game', () => {
    let game = new HangmanGame('____', 0, 'lose');
    
    assert.isFalse(game.guess('z'));
    assert.equal('____', game.progress);
    assert.equal(1, game.fails);

    assert.isFalse(game.guess('x'));
    assert.equal('____', game.progress);
    assert.equal(2, game.fails);

    assert.isFalse(game.guess('c'));
    assert.equal('____', game.progress);
    assert.equal(3, game.fails);

    assert.isTrue(game.guess('s'));
    assert.equal('__s_', game.progress);
    assert.equal(3, game.fails);

    assert.isFalse(game.guess('v'));
    assert.equal('__s_', game.progress);
    assert.equal(4, game.fails);
    
    assert.isFalse(game.guess('b'));
    assert.equal('__s_', game.progress);
    assert.equal(5, game.fails);

    assert.isTrue(game.hasLost);
  });

  it('encodes the game state', () => {
    let game = new HangmanGame('_______', 0, 'customs');
    let encoded = game.encode();

    assert.isObject(encoded);
    assert.include(encoded, { state: 'playing' });
  });

});  
