#! /usr/bin/env node

var program = require('commander');

var dasherize = require('../utils/string').dasherize;
var Promise = require('../ext/promise');
var ui = require('../ui');

var options = {};

program
  .usage('<addonType> <addonName>');

program
  .command('library <addonName>')
  .description('Extract a library')
  .action(function(addonName) {
    options.addonName = addonName ? dasherize(addonName) : null;
    require('../tasks/extract-library')(options).catch(ui.error);
  });

program
  .command('helper <addonName>')
  .description('Extract a helper')
  .action(function(addonName) {
    options.addonName = addonName ? dasherize(addonName) : null;
    require('../tasks/extract-helper')(options).catch(ui.error);
  });

program
  .command('component <addonName>')
  .description('Extract a component')
  .action(function(addonName) {
    options.addonName = addonName ? dasherize(addonName) : null;
    require('../tasks/extract-component')(options).catch(ui.error);
  });

program
  .parse(process.argv);

if (process.argv.length < 3) {
  program.outputHelp();
}