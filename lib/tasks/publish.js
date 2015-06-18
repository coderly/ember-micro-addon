/*jshint node:true*/
'use strict';

var path = require('path');

var runCommand = require('../utils/run-command');
var Promise = require('../ext/promise');

module.exports = function(options) {
  options.workingDirectory = path.join(process.cwd(), options.name);

  return require('../tasks/git-init')(options).then(function() {
    return require('../tasks/git-publish')(options);
  });
};
