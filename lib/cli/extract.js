#! /usr/bin/env node

var program = require('commander');

var dasherize = require('../utils/string').dasherize;
var Promise = require('../ext/promise');
var ui = require('../ui');

function validateOptions(options) {
  return new Promise(function(resolve, reject) {
    if (!options.addonType) {
      reject('You must provide the type of the addon you wish to extract');
    } else if (!options.addonName) {
      reject('You must provide a name of the addon you wish to extract');
    } else {
      resolve(options);
    }
  });
}

function run(options) {
  if (options.addonType === 'library') {
    return require('../tasks/extract-library')(options);
  } else if (options.addonType === 'helper') {
    return require('../tasks/extract-helper')(options);
  } else if (options.addonType === 'component') {
    return require('../tasks/extract-component')(options);
  }
}

program
  .arguments('<addonType> <addonName>')
  .action(function(addonType, addonName) {
    program.addonType = addonType;
    program.addonName = addonName;
  })
  .parse(process.argv);

var options = {
  addonType: program.addonType ? program.addonType : null,
  addonName: program.addonName ? dasherize(program.addonName) : null
};

return validateOptions(options)
  .then(run)
  .catch(ui.error);