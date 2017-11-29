const http = require('http');
const readline = require('readline');
const host = 'localhost';
const port = 3003;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let session = '';

makeStartRequest().then((game) => {
  if(!game.progress) return reportError('TODO: Implement HangmanGame.createNew');

  console.log('Welcome to hangman. Your starting letters are: ', game.progress);
  session = game.session;
  prompt();
}).catch((e) => {
  reportError(e);
});

function prompt() {
  rl.question('What is your next guess? ', (answer) => {
    answer = answer.trim().toLowerCase();

    if(answer === '') {
      console.log('Your guess cannot be a white space.');
      console.log('\r');
      return prompt();
    }

    if(answer.length > 1) {
      console.log('You can only answer with a single letter.');
      console.log('\r');
      return prompt();
    }

    makeGuessRequest(answer).then((game) => {
      session = game.session;
      status(game);
    }).catch((e) => {
      reportError(e);
    });
  });
}

function status(game) {
  switch(game.state) {
    case 'won':
      console.log('You WON!!!!');
      console.log(`You completed the phrase '${game.progress}'`);
      process.exit(0);
      break;
    case 'lost':
      console.log(`You reached ${game.fails} fails, you LOST :(`)
      process.exit(0);
      break;
    default:
      game.correct ? console.log('Correct!') : console.log('Wrong!');
      console.log(`Your progress: ${game.progress}`, ` Errors: ${game.fails}`);
      console.log('\r');
      prompt();
  }
}

function reportError(err) {
  console.error('It looks like something went wrong')
  console.error(err.stack || err);
  process.exit(1);
}

function makeStartRequest() {
  return new Promise((resolve, reject) => {
    let params = { method: 'GET', host, port, path: '/start' };

    http.request(params, response => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          resolve(JSON.parse(data));
        }
        catch(e) { reject(e); }
      });
      
      response.on('error', () => reject('An error ocurred while connecting to the server.'));
    }).end();
  });
}

function makeGuessRequest(guess) {
  return new Promise((resolve, reject) => {
    let params = { 
      method: 'POST',
      host,
      port,
      path: '/guess/' + guess,
      headers: { 'Content-Type':  'text/plain' }
    };

    let req = http.request(params, response => {
      let data = '';
      response.on('data', chunk => data += chunk)
      response.on('end', () => {
        try {
          resolve(JSON.parse(data));
        }
        catch(e) { reject(e); }
      });
      response.on('error', () => reject('An error ocurred while connecting to the server.'));
    });

    req.write(session);
    req.end();
  });
}
