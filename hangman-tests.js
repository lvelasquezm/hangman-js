const assert = require('chai').assert;
const HangmanGame = require('./hangman');

describe('hangman-game', () => {

  it('creates a new game', () => {
    return HangmanGame.createNew().then(game => {
      assert.equal(game.word.length, game.progress.length);
      assert.match(game.progress,/^[ _ ]+$/);
    });
  })

  it('guesses first letter correctly', () => {
    let game = new HangmanGame('_______',0,'customs');
    assert.isTrue(game.guess('c'));
    assert.equal('c______', game.progress);
    assert.equal(0, game.fails);
  })

  it('guesses multiple letters correctly', () => {
    let game = new HangmanGame('_______',0,'customs');
    assert.isTrue(game.guess('s'));
    assert.equal('__s___s', game.progress);
    assert.equal(0, game.fails);
  })

  it('handles bad guesses', () => {
    let game = new HangmanGame('_______',0,'customs');
    assert.isFalse(game.guess('a'));
    assert.equal('_______', game.progress);
    assert.equal(1, game.fails);
  })
  // TODO: Add a unit test. Add a test that you think would be high value in catching existing or future bugs.
  // TODO: Add another unit test.
});
