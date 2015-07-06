#! /usr/bin/env node

var program = require('commander');
var path = require('path');

var dasherize = require('../utils/string').dasherize;
var ui = require('../ui');

program
  .arguments('<destinationPath>')
  .usage('<destinationPath> [--addon-name|-n <addon-name>]')
  .option('-n, --addonName <addonName>')
  .action(function(destinationPath) {
    program.destinationPath = destinationPath;
  });

program
  .parse(process.argv);

function runTask() {
  require('../tasks/generate-component')(options).catch(ui.error);
}

function buildOptions() {
  var options = {};

  console.log

  if (program.addonName) {
    options.addonName = dasherize(program.addonName);
  } else {
    options.addonName = path.basename(program.destinationPath);
  }

  if (program.destinationPath) {
    if (path.isAbsolute(program.destinationPath)) {
      options.destinationPath = program.destinationPath;
    } else {
      options.destinationPath = path.resolve(program.destinationPath);
    }
  }

  return options;
}

if (process.argv.length < 3) {
  program.outputHelp();
} else {
  var options = buildOptions();
  runTask(options);
}
