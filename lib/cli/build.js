#! /usr/bin/env node

var program = require('commander');

var dasherize = require('../utils/string').dasherize;
var Promise = require('../ext/promise');
var ui = require('../ui');

program
  .usage('<addonName>')
  .arguments('<addonName>')
  .action(function(addonName) {
    if (addonName) {
      require('../tasks/build')({ addonName: addonName }).catch(ui.error);
    }
  })
  .parse(process.argv);

if (process.argv.length < 3) {
  program.outputHelp();
}
