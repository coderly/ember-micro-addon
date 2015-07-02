/* jshint node:true*/

var storage = require('node-persist');
var path = require('path');

var TOKEN_KEY = 'ember-micro-github-token';
var CREDENTIAL_FOLDER =+ '.ember-micro-addon-credentials';

var Promise = require('../ext/promise');
var initStorage = Promise.denodeify(storage.init);
var setItem = Promise.denodeify(storage.setItem);
var getItem = Promise.denodeify(storage.getItem);
var persist = Promise.denodeify(storage.persist);

var cachedToken;

function getUserHome() {
  var userHome = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
  return path.join(userHome, CREDENTIAL_FOLDER);
}

module.exports = {
  setToken: function(token) {
    cachedToken = token;
    initStorage({ dir: getUserHome() }).then(function () {
      console.log('storing token', TOKEN_KEY, token);
      setItem(TOKEN_KEY, token).then(persist);
    });
  },
  getToken: function() {
    return new Promise(function(resolve) {
      if (cachedToken) {
        resolve(cachedToken);
      } else {
        initStorage({ dir: getUserHome() }).then(function() {
          return getItem(TOKEN_KEY);
        }).then(resolve);
      }
    });
  }
};