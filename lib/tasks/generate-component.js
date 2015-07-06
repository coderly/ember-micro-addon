/*jshint node:true*/
'use strict';

var path = require('path');
var runCommand = require('../utils/run-command');

var BLUEPRINT_NAME = 'micro-component';
var BLUEPRINT_FOLDER_RELATIVE_PATH = '../../blueprints';
var BLUEPRINT_PATH = path.resolve(__dirname, BLUEPRINT_FOLDER_RELATIVE_PATH, BLUEPRINT_NAME);

function generateComponent(options) {
  var command = 'ember new ' + options.addonName + ' --blueprint ' + BLUEPRINT_PATH + ' --skip-npm --skip-bower --skip-git';

  if (options.destinationPath) {
    command += ' --directory ' + options.destinationPath;
  }

  var msg = 'Creating micro-component in ./' + options.destinationPath;
  return runCommand(command, msg, {
    cwd: process.cwd()
  })();
}

module.exports = function(options) {
  return generateComponent(options);
};
