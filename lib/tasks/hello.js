/*jshint node:true*/
'use strict';

var runCommand = require('../utils/run-command');

module.exports = function(rawArgs, project) {

  var command = 'echo ' + 'Hello World!';
  var msg = "Running 'hello'";

  return function(){
    return runCommand(command, msg, {
      cwd: project.root
    })();
  };
};
