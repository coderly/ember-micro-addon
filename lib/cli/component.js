#! /usr/bin/env node

var program = require('commander');

var dasherize = require('../utils/string').dasherize;
var ui = require('../ui');

program
  .arguments('<addonName>')
  .usage('<addonName')
  .action(function(addonName) {
    if (addonName) {
      require('../tasks/component')({ addonName: dasherize(addonName) }).catch(ui.error);
    }
  });

program
  .parse(process.argv);

if (process.argv.length < 3) {
  program.outputHelp();
}
