/*jshint node:true*/
'use strict';

var path = require('path');
var Promise = require('../ext/promise');
var runCommand = require('../utils/run-command');

module.exports = function(rawArgs) {

  var name = rawArgs[0];
  if (name) {
    var blueprintName = "micro-library";
    var blueprintFolderRelativePath = "../../blueprints";
    var blueprintPath = path.resolve(__dirname, blueprintFolderRelativePath, blueprintName);
    var command = 'ember new ' + name + ' --blueprint ' + blueprintPath + ' --skip-npm --skip-bower --skip-git';
    var msg = 'Creating micro-library in ./' + name
    return runCommand(command, msg, {
      cwd: process.cwd()
    })();
  } else {
    return Promise.reject(new Error('A "name" parameter is required to generate a micro-library'));
  }

};
