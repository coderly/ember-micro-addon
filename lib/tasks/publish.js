/*jshint node:true*/
'use strict';

var path = require('path');

module.exports = function(options) {
  options.workingDirectory = path.join(process.cwd(), options.addonName);

  return require('../tasks/git-init')(options).then(function() {
    return require('../tasks/git-publish')(options);
  });
};
