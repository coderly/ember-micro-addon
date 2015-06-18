/*jshint node:true*/
'use strict';

var chalk = require('chalk');


module.exports = {
  write: function(msg) {
    console.log(chalk.green(msg));
  },
  error: function(msg) {
    console.log(chalk.red(msg));
  }
};
