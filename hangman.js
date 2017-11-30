const wordList = require('./word-list');
const crypt = require('./crypt');
const _ = require('lodash');

const FAILS_TO_LOSE = 5;

class HangmanGame {

  constructor(progress, fails, word, guesses) {
    this.progress = progress;
    this.fails = fails;
    this.word = word;
    this.guesses = guesses;
  }

  get hasWon() {
    return this.word.toLowerCase() === this.progress.toLowerCase();
  }

  get hasLost() {
    return this.fails === FAILS_TO_LOSE;
  }

  static createNew() {
    return wordList.random().then(word => {
      let progress = word.split('').map(char => {
        if(char === ' ') return ' ';
        else return '_';
      }).join('');
      
      return new HangmanGame(progress, 0, word, []);
    });
  }

  guess(guess) {
    this.guesses.push(guess);

    // guess was correct
    if(this.word.includes(guess)) {
      const wordChunks = this.word.split('');
      let progressChunks = this.progress.split('');

      wordChunks.forEach((char, index) => {
        if(char === guess) progressChunks[index] = char;
      });

      this.progress = progressChunks.join('');
      return true;
    }

    // guess was incorrect
    this.fails++;
    return false;
  }

  encode() {
    return {
      state: this.hasWon ? 'won' : this.hasLost ? 'lost' : 'playing',
      progress: this.progress,
      fails: this.fails,
      guesses: this.guesses,
      session: crypt.encrypt({
        word: this.word,
        progress: this.progress,
        fails: this.fails,
        guesses: this.guesses
      })
    };
  }

  static decode(session) {
    let sessionObj = crypt.decrypt(session);
    return new HangmanGame(sessionObj.progress, sessionObj.fails, sessionObj.word, sessionObj.guesses);
  }

}

module.exports = HangmanGame;
