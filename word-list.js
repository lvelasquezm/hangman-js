const _ = require('lodash');
const fs = require('fs');

exports.random = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + '/words.txt', 'utf8', (err, txt) => {
      if(err) return reject(err);
      resolve(_.sample(txt.split('\n')));
    });
  });
};
