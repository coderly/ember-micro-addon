/*jshint node:true*/
'use strict';

var path = require('path');
var git = require('nodegit');
var GitHubAPI = require('github');

var Promise = require('../ext/promise');
var ui = require('../ui');
var gitHubCredentials = require('../utils/github-credentials');

function createGitSignature(options) {
  var millisecondsFromStandardEpoch = Date.now();
  var secondsFromStandardEpoch = Math.floor(millisecondsFromStandardEpoch / 1000);

  return git.Signature.create('ember-micro', options.username, secondsFromStandardEpoch, 60);
}

function createLocalRepo(options) {
  return initLocalRepo(options).then(function (localRepo) {
    return addExistingFilesToLocalRepo(localRepo).then(function(oid) {
      return createInitialCommitOnLocalRepo(options, localRepo, oid);
    }).then(function() {
      return localRepo;
    });
  });
}

function initLocalRepo(options) {
  ui.write('Initializing local repository in ' + options.workingDirectory);

  return git.Repository.init(options.workingDirectory, 0);
}

function addExistingFilesToLocalRepo(localRepo) {
  return localRepo.openIndex().then(function(index) {
    return index.addAll().then(function() {
      return index.write();
    }).then(function() {
      return index.writeTree();
    });
  });
}

function createInitialCommitOnLocalRepo(options, localRepo, oid) {
  var signature = createGitSignature(options);

  return localRepo.createCommit("HEAD", signature, signature, "Initial commit", oid, []);
}

function createRemoteRepo(github, repoName) {
  ui.write('Creating remote repository...');

  return new Promise(function(resolve, reject) {
    github.repos.create({
      name: repoName
    }, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function addRemoteOrigin(localRepo, remoteRepo) {
  var result = git.Remote.create(localRepo, 'origin', remoteRepo.html_url);
  console.log('result', result);
  return result;
}

function pushToRepo(options, localRepo, remote) {
  ui.write('Pushing to remote repository...');

  remote.setCallbacks({
    credentials: function() {
      return git.Cred.userpassPlaintextNew(options.username, options.password);
    }
  });

  var refSpecs = ['refs/heads/master:refs/heads/master'];
  var pushOptions = {};
  var signature = localRepo.defaultSignature();
  var message = "Initial push to master";

  return remote.push(refSpecs, pushOptions, signature, message);
}

function initializeGitHub(options) {
  var github = new GitHubAPI({
    version: '3.0.0',
  });

  return gitHubCredentials.getToken().then(function(token) {
    console.log('token exists:', token);
    authenticateWithToken(github, token);
    return github;
  }).catch(function() {
    console.log('token missing, creating');
    authenticateWithUserProvidedCredentials(github,options);
    return createToken(github).then(function() {
      return github;
    });
  });
}

function authenticateWithToken(github, token) {
  github.authenticate({
    type: 'oauth',
    token: token,
  });
}

function authenticateWithUserProvidedCredentials(github, options) {
  github.authenticate({
    type: 'basic',
    username: options.username,
    password: options.password
  });
}

function createToken(github) {
  return new Promise(function(resolve, reject) {
    github.authorization.create({
      scopes: ['user', 'public_repo', 'repo', 'repo:status', 'gist'],
      note: 'ember-micro-addon authorization',
      note_url: 'https://github.com/coderly/ember-micro-addon',
      headers: {
        'X-GitHub-OTP': 'two-factor-code'
      },
    }, function(err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res.token);
      }
    });
  });
}

module.exports = function(options) {
  options.workingDirectory = path.join(process.cwd(), options.addonName);

  return initializeGitHub(options).then(function(github) {
    ui.write('Publishing ' + options.addonName + ' to GitHub...');
    return createLocalRepo(options).then(function(localRepo) {
      return createRemoteRepo(github, options.addonName).then(function(remoteRepo) {
        return addRemoteOrigin(localRepo, remoteRepo);
      }).then(function(remoteResult) {
        return pushToRepo(options, localRepo, remoteResult);
      });
    });
  });

};
