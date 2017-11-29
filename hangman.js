const wordList = require('./word-list');
const crypt = require('./crypt');
const _ = require('lodash');

const FAILS_TO_LOSE = 5;

class HangmanGame {

  // Progress is the underscores for unknown letters, and the letters for know values, such as v__i___ o_ _i___i__
  // Fails is an integer value of the number of wrong guesses made. We're not keeping track of which wrong letters were guessed
  // Word is the word (well, really phrase) the end user is trying to guess
  constructor(progress, fails, word) {
    this.progress = progress;
    this.fails = fails;
    this.word = word;
  }

  get hasWon() {
    // TODO: Implement this. Return True if the game state is such that the user has won, and false otherwise
    return this.word.toLowerCase() === this.progress.toLowerCase();
  }

  get hasLost() {
    // TODO: Implement this. Return True if the game state is such that the user has lost, and false otherwise
    return this.fails === FAILS_TO_LOSE;
  }

  static createNew() {
    return wordList.random().then(word => {
      //TODO: Progress should be the word with letters replaced with underscores, and spaces as they were.
      // e.g. "variety of wildlife" becomes "_______ __ ________"
      let progress = word.split('').map(char => {
        if(char === ' ') return ' ';
        else return '_';
      }).join('');

      return new HangmanGame(progress, 0, word);
    });
  }

  guess(guess) {
    //TODO Implement this. Guess is the letter being guessed.
    // If guess is in the word/phrase being guessed, return true, and update this.progress to reflect the new known letter positions
    // Otherwise, increment fails
    //  Return true for a good guess, and false otherwise

    // guess exists in current word
    if(this.word.indexOf(guess) !== -1) {
      const wordChunks = this.word.split('');
      let progressChunks = this.progress.split('');

      wordChunks.forEach((char, index) => {
        if(char === guess) progressChunks[index] = char;
      });

      this.progress = progressChunks.join('');

      console.log(this.progress);
      return true;
    }

    this.fails++;
    return false;
  }

  encode() {
    return {
      state: this.hasWon ? 'won' : this.hasLost ? 'lost' : 'playing',
      progress: this.progress,
      fails: this.fails,
      session: crypt.encrypt({
        word: this.word,
        progress: this.progress,
        fails: this.fails
        /* TODO fill this with values you want to persist */
      })
      //TODO: What values do you want to hold as "session" values?
      //These are values that are encrypted and represent your game state that should not be visible to the opponent nor tampered with
    };
  }

  static decode(session) {
    //TODO: Construct a HangmanGame based on the session values you've stored above
    let sessionObj = crypt.decrypt(session);
    return new HangmanGame(sessionObj.progress, sessionObj.fails, sessionObj.word);
  }

}

module.exports = HangmanGame;
