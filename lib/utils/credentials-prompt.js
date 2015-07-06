var cliPrompt = require('prompt');

cliPrompt.message = '';
cliPrompt.delimiter = '';

var promptSchema = {
  properties: {
    username: {
      description: 'GitHub username: ',
      message: 'A username is required.',
      required: true
    },
    password: {
      description: 'GitHub password: ',
      message: 'A password is required.',
      required: true,
      hidden: true
    }
  }
};

var Promise = require('../ext/promise');

module.exports = function promptForCredentials() {
  cliPrompt.start();
  return new Promise(function(resolve, reject) {
    cliPrompt.get(promptSchema, function(error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
