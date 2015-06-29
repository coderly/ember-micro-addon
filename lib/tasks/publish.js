/*jshint node:true*/
'use strict';

var path = require('path');
var git = require('nodegit');
var GitHubAPI = require('github');

var Promise = require('../ext/promise');
var ui = require('../ui');

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

function createRemoteRepo(gitHubApi, repoName) {
  ui.write('Creating remote repository...');

  return new Promise(function(resolve, reject) {
    gitHubApi.repos.create({
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
  return git.Remote.create(localRepo, 'origin', remoteRepo.html_url);
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

function initializeGitHubAPI() {
  return new GitHubAPI({
    version: '3.0.0',
  });
}

function authenticateGitHubAPI(gitHubApi, options) {
  gitHubApi.authenticate({
    type: 'basic',
    username: options.username,
    password: options.password
  });
}

module.exports = function(options) {
  options.workingDirectory = path.join(process.cwd(), options.addonName);

  var gitHubApi = initializeGitHubAPI();

  authenticateGitHubAPI(gitHubApi, options);

  ui.write('Publishing ' + options.addonName + ' to GitHub...');
  return createLocalRepo(options).then(function(localRepo) {
    return createRemoteRepo(gitHubApi, options.addonName).then(function(remoteRepo) {
      return addRemoteOrigin(localRepo, remoteRepo);
    }).then(function(remoteResult) {
      return pushToRepo(options, localRepo, remoteResult);
    });
  });

};
