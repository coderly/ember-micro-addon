#! /usr/bin/env node

var program = require('commander');
var path = require('path');

var dasherize = require('../utils/string').dasherize;
var ui = require('../ui');

var options = {};
var task;

program
  .usage('<addonType> <addonName>')
  .option('-d, --destination <destination>', 'Extract destination');

program
  .command('library <addonName>')
  .description('Extract a library')
  .action(function(addonName) {
    options.addonName = addonName ? dasherize(addonName) : null;
    task = require('../tasks/extract-library');
  });


program
  .command('helper <addonName>')
  .description('Extract a helper')
  .action(function(addonName) {
    options.addonName = addonName ? dasherize(addonName) : null;
    task = require('../tasks/extract-helper');
  });


program
  .command('component <addonName>')
  .description('Extract a component')
  .action(function(addonName) {
    options.addonName = addonName ? dasherize(addonName) : null;
    task = require('../tasks/extract-component');
  });


program
  .parse(process.argv);

if (process.argv.length < 3) {
  program.outputHelp();
} else {
  options.destination = program.destination || getDefaultExtractDestination(options.addonName);
  task(options).catch(ui.error);
}

function getDefaultExtractDestination(addonName) {
  return path.resolve(path.join('..', addonName));
}
