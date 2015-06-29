/*jshint node:true*/
'use strict';

var runCommand = require('../utils/run-command');

function checkIfGitIsInitialized(workingDirectory) {
  return runCommand('git status', null, {
    cwd: workingDirectory,
    silent: true
  })().then(function() {
    return true;
  }).catch(function() {
    return false;
  });
}

function gitInit(workingDirectory) {
  var msg = 'Initializing git repository...';
  var command = 'git init';
  return runCommand(command, msg, {
    cwd: workingDirectory
  })();
}

function gitAdd(workingDirectory) {
  var msg = 'Adding addon files to repository...';
  var command = 'git add .';
  return runCommand(command, msg, {
    cwd: workingDirectory
  })();
}

function gitCommit(workingDirectory) {
  var msg = 'Creating first commit...';
  var command = 'git commit -m "Initial commit"';

  return runCommand(command, msg, {
    cwd: workingDirectory
  })();
}

module.exports = function(options) {
  return checkIfGitIsInitialized(options.workingDirectory).then(function(isGitInitialized) {
    if (isGitInitialized) {
      return true;
    } else {
      return gitInit(options.workingDirectory).then(function() {
        return gitAdd(options.workingDirectory);
      }).then(function () {
        return gitCommit(options.workingDirectory);
      });
    }
  });
};
