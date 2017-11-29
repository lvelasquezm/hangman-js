Hangman Take Home Test
======================

Thank you for considering RAIN. Included here is a short (2-3 hours) development test in NodeJS.
This code base is supposed to implement an API for a hangman game, but it is incomplete.
Fill in all of the sections with TODOs to fill in missing code.

Setup
------
Be sure to run `npm install` before anything else.
`npm run start` should then boot a server on port 3003.
Then run `node play-agent.js` and you'll see an error messaging saying that not everything is implemented in `hangman.js`

Tasks
------
1. Implement all of the missing code in `hangman.js`. When completed, all unit tests should pass, and `node play-agent.js` should be able to play the game.
2. Add two unit tests to hangman-tests.js. Add unit tests that you think are high-value.
3. Convert play-agent.js from using callbacks to promises.
4. Write me an email with your solution zipped up. In the email, include a brief critic about how `HangmanGame.js` could be better structured.

Session
-------
One of the challenges of making a hangman game is dealing with the session state.
We need to keep track of the game progress (e.g. what the target word is) without also telling the user what that word is.
Another implementation might do this by keeping track of the game state in a database (e.g. Redis), however, this implementation handles
this by using a session value that is passed back and forth between the client and the server on each request.
This session should hold enough information to reconstruct the game state, should be obfusciated from the user, and also prevent the end user
from tampering it's values.
`crypt.js` provides utility methods for encrypint and decrypting a Javascript object into and from a string.
The session value will be returned in the JSON body of the `/start` request, and each `/guess` request.
The session value should also be passed in the body as plain-text in each `/guest` request.
The `play-agent.js` currently does this correctly.

some Important Files
--------------------
`server.js ` This is how you start the server. It should launch on port 3003, then you'll need to interact with it via an HTTP composer tool or play-agent.js to play a game.
`hangman.js ` This is the logic of a hangman game. Most of the missing code is here
`play-agent.js` An independent NodeJS command line application that will use the API to play a game
`crypt.js` A helper file for encrypting and decrypting data
