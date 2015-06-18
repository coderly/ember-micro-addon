/*jshint node:true*/
'use strict';

var runCommand = require('../utils/run-command');

module.exports = function(/*options*/) {
  var msg = 'Initializing git repository...';
  var command = 'echo Publish step is now';
  return runCommand(command, msg, {
    cwd: process.cwd()
  })();
};
