const express = require('express');
const morgan = require('morgan');
const HangmanGame = require('./hangman');
const port = 3003;

const app = express();
app.use(morgan('dev'));
app.use(require('body-parser').text());

app.get('/start', (req, res, next) => {
  HangmanGame.createNew().then(game => {
    res.json(game.encode());
  }, next);
});

app.post('/guess/:guess', (req, res, next) => {
  let game = HangmanGame.decode(req.body);

  if(game.guesses.includes(req.params.guess)) {
    res.json(Object.assign({ isLetterGuessed: true }, game.encode()));
  }else {
    let correct = game.guess(req.params.guess);
    res.json(Object.assign({correct}, game.encode()));
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
