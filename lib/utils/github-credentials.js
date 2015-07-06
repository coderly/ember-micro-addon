/* jshint node:true*/

var storage = require('node-persist');
var path = require('path');

var TOKEN_KEY = 'ember-micro-github-token';
var CREDENTIAL_FOLDER = '.ember-micro-addon-credentials';

var Promise = require('../ext/promise');
var setItem = Promise.denodeify(storage.setItem);
var getItem = Promise.denodeify(storage.getItem);


var cachedToken;

function getUserHome() {
  var userHome = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
  return path.join(userHome, CREDENTIAL_FOLDER);
}

storage.initSync({ dir: getUserHome() });

module.exports = {
  setToken: function(token) {
    cachedToken = token;
    return setItem(TOKEN_KEY, token);
  },
  getToken: function() {
    return new Promise(function(resolve) {
      if (cachedToken) {
        resolve(cachedToken);
      } else {
        return getItem(TOKEN_KEY).then(resolve);
      }
    });
  }
};