/*jshint node:true*/
'use strict';

var GitHubAPI = require('github');

var Promise = require('../ext/promise');
var runCommand = require('../utils/run-command');
var ui = require('../ui');

function createRepo(api, name) {
  return new Promise(function(resolve, reject) {
    api.repos.create({
      name: name
    }, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function addRemote(repo) {
  return runCommand('git remote -add origin ' + repo.url, null, {
    cwd: process.cwd()
  })();
}

function pushToRepo() {
  return runCommand('git push', null, {
    cwd: process.cwd()
  })();
}

module.exports = function(options) {
  var github = new GitHubAPI({
    version: '3.0.0',
  });

  github.authenticate({
    type: 'basic',
    username: options.username,
    password: options.password
  });

  ui.write('Publishing to GitHub...');
  return createRepo(github, options.addonName).then(addRemote).then(pushToRepo);
};
