#! /usr/bin/env node

var program = require('commander');

var dasherize = require('../utils/string').dasherize;
var ui = require('../ui');

program
  .arguments('<addonName>')
  .action(function(addonName) {
    if (addonName) {
      require('../tasks/helper')({ addonName: dasherize(addonName) }).catch(ui.error);
    }
  });

program
  .parse(process.argv);

if (process.argv.length < 3) {
  program.outputHelp();
}
