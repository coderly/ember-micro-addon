/*jshint node:true*/
'use strict';

var path = require('path');
var GitHubAPI = require('github');
var git = require('nodegit');

var Promise = require('../ext/promise');
var ui = require('../ui');


function createLocalRepo(git, options) {
  var signature = authenticateGit(git, options);
  return initLocalRepo(git, options).then(function (localRepo) {
    return addExistingFilesToLocalRepo(git, localRepo).then(function(oid) {
      return createInitialCommitOnLocalRepo(localRepo, signature, oid);
    }).then(function() {
      return localRepo;
    });
  });
}

function initLocalRepo(git, options) {
  ui.write('Initializing local repository in ' + options.workingDirectory);

  return git.Repository.init(options.workingDirectory, 0);
}

function addExistingFilesToLocalRepo(git, localRepo) {
  return localRepo.openIndex().then(function(index) {
    return index.addAll().then(function() {
      return index.writeTree();
    });
  });
}

function createInitialCommitOnLocalRepo(localRepo, signature, oid) {
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

function addRemoteOrigin(git, localRepo, remoteRepo) {
  return git.Remote.create(localRepo, 'origin', remoteRepo.html_url);
}

function pushToRepo(git, options, localRepo, remote) {
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

function authenticateGit(git, options) {
  var millisecondsFromStandardEpoch = Date.now();
  var secondsFromStandardEpoch = Math.floor(millisecondsFromStandardEpoch / 1000);

  return git.Signature.create('ember-micro', options.username, secondsFromStandardEpoch, 60);
}

module.exports = function(options) {
  options.workingDirectory = path.join(process.cwd(), options.addonName);

  var gitHubApi = initializeGitHubAPI();

  authenticateGitHubAPI(gitHubApi, options);

  ui.write('Publishing ' + options.addonName + ' to GitHub...');
  return createLocalRepo(git, options).then(function(localRepo) {
    return createRemoteRepo(gitHubApi, options.addonName).then(function(remoteRepo) {
      return addRemoteOrigin(git, localRepo, remoteRepo);
    }).then(function(remoteResult) {
      return pushToRepo(git, options, localRepo, remoteResult);
    });
  });

};
