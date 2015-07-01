/*jshint node:true*/
'use strict';

var path = require('path');
var runCommand = require('../utils/run-command');

module.exports = function(options) {
  var blueprintName = "micro-component";
  var blueprintFolderRelativePath = "../../blueprints";
  var blueprintPath = path.resolve(__dirname, blueprintFolderRelativePath, blueprintName);
  var command = 'ember new ' + options.addonName + ' --blueprint ' + blueprintPath + ' --skip-npm --skip-bower --skip-git';
  var msg = 'Creating micro-component in ./' + options.addonName;
  return runCommand(command, msg, {
    cwd: process.cwd()
  })();
};
