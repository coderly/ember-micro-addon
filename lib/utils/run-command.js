/*jshint node:true*/
'use strict';

var Promise  = require('../ext/promise');
var exec     = require('child_process').exec;
var ui       = require('../ui');
var defaults = require('lodash').defaults;

module.exports = function runCommand(command, startedMsg, options) {
  if(options == null) {
    options = {};
  }

  return function() {
    if(startedMsg) {
      ui.write(startedMsg);
    }

    options = defaults(options, {
      maxBuffer: 5000 * 1024
    });

    return new Promise(function(resolve, reject) {
      exec(command, options, function(err, stdout, stderr) {
        if (stdout && stdout.length && !options.silent) {
          ui.write(stdout);
        }

        if (stderr && stderr.length && !options.silent) {
          ui.write(stderr);
        }

        if (err) {
          if (!options.silent) {
            return reject(commandError(command, err));
          } else {
            return reject(err);
          }
        }

        resolve(stdout);
      });
    });
  };
};

function commandError(command, err) {
  ui.error('Error thrown while running shell command: "' + command);
  if(err.stack) {
    ui.write(err.stack);
  } else {
    ui.write(err);
  }
}
