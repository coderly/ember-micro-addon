/*jshint node:true*/
'use strict';

var Promise = require('../ext/promise');
var runCommand = require('../utils/run-command');

module.exports = function(rawArgs, project) {

  var name = rawArgs[0];
  if (name) {
    var command = 'ember new ' + name + ' --blueprint ./node_modules/ember-micro-addon/blueprints/micro-component --skip-npm --skip-bower --skip-git'
    var msg = 'Creating micro-component in ./' + name
    return runCommand(command, msg, {
      cwd: project.root
    })();
  } else {
    return Promise.reject(new Error('A "name" parameter is required to generate a micro-component'));
  }

};
