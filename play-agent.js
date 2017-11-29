const http = require('http');
const readline = require('readline');
const host = 'localhost';
const port = 3003;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let session = '';

// TODO: Replace this callback with a promise
makeStartRequest( (err, game) => {
  if(err) return reportError(err);
  if(!game.progress) return reportError('TODO: Implement HangmanGame.createNew');

  console.log('Welcome to hangman. Your starting letters are: ', game.progress);
  session = game.session;
  prompt();
});

function prompt() {
  // TODO: Replace this callback with a promise
  rl.question('What is your next guess?', (answer) => {
    if(answer.length > 1) {
      console.log('You can only answer with a single letter.');
      return prompt();
    }

    makeGuessRequest(answer, (err, game) => {
      if(err) return reportError(err);
      session = game.session;
      status(game);
    });
  })

}

function status(game) {
  if(game.state == 'won') {
    console.log('You WON!!!!')
    process.exit(0);
  }
  else if(game.state == 'lost') {
    console.log('You LOST :(')
    process.exit(0);
  }
  else {
    if(game.correct) console.log('Correct')
    else console.log('Wrong')
    console.log(game.progress, '   errors: ', game.fails);
    prompt();
  }
}

function reportError(err) {
  console.error('It looks like something went wrong')
  console.error(err.stack || err);
  process.exit(1);
}

// TODO: Replace this callback with a promise
function makeStartRequest(cb) {
   http.request({
    method: 'GET',
    host,
    port,
    path: '/start'
   },response => {
     let data = '';
     response.on('data',chunk => data += chunk)
     response.on('end',() => {
       try {
         cb(null, JSON.parse(data));
       }
       catch(e) { cb(e) }
     })
     response.on('error', cb);
   }).end()
}

// TODO: Replace this callback with a promise
function makeGuessRequest(guess, cb) {
   let req = http.request({
    method: 'POST',
    host,
    port,
    path: '/guess/' + guess,
    headers: { 'Content-Type': 'text/plain' }
   },response => {
     let data = '';
     response.on('data',chunk => data += chunk)
     response.on('end',() => {
       try {
         cb(null, JSON.parse(data));
       }
       catch(e) { cb(e) }
     })
     response.on('error', cb);
   });

  req.write(session);
  req.end();
}
