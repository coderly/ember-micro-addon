#! /usr/bin/env node

var program = require('commander');

var dasherize = require('../utils/string').dasherize;
var Promise = require('../ext/promise');
var ui = require('../ui');

function validateOptions(options) {
  return new Promise(function(resolve, reject) {
    if (!options.addonName) {
      reject('You must provide a name of the helper you wisth to generate.');
    } else {
      resolve(options);
    }
  });
}

function run(options) {
  return require('../tasks/helper')(options);
}

program
  .arguments('<addonName>')
  .action(function(addonName) {
    program.addonName = addonName;
  })
  .parse(process.argv);

var options = {
  addonName: dasherize(program.addonName)
};

return validateOptions(options)
  .then(run)
  .catch(ui.error);
