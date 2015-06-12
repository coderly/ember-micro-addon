/* jshint node: true */
'use strict';

var commands = require('./lib/commands');

module.exports = {
  name: 'ember-micro-addon',

  includedCommands: function() {
    return commands;
  }
};
