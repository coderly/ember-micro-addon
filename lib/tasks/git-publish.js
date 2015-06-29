/*jshint node:true*/
'use strict';

var GitHubAPI = require('github');

var Promise = require('../ext/promise');
var runCommand = require('../utils/run-command');
var ui = require('../ui');

function createRepo(api, name) {
  ui.write('Creating remote repository...');
  return new Promise(function(resolve, reject) {
    api.repos.create({
      name: name
    }, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result.html_url);
      }
    });
  });
}

function addRemote(url, workingDirectory) {
  ui.write('Adding remote origin...');
  return runCommand('git remote add origin ' + url, null, {
    cwd: workingDirectory
  })();
}

function pushToRepo(options) {
  ui.write('Pushing to remote repository');
  return runCommand('git push -u origin master', null, {
    cwd: options.workingDirectory
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
  return createRepo(github, options.addonName).then(function(url) {
    return addRemote(url, options.workingDirectory);
  }).then(function() {
    return pushToRepo(options);
  });
};
