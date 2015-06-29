#! /usr/bin/env node

var program = require('commander');

var dasherize = require('../utils/string').dasherize;
var Promise = require('../ext/promise');
var ui = require('../ui');

function validateOptions(options) {
  return new Promise(function(resolve, reject) {
    if (!options.addonName) {
      reject('You must provide a name of the addon you wish to publish');
    } else if (!options.username) {
      reject('A GitHub username is required');
    } else if (!options.password) {
      reject('A GitHub password is required');
    } else {
      resolve(options);
    }
  });
}

function run(options) {
  return require('../tasks/publish')(options);
}

program
  .arguments('<addonName>')
  .action(function(addonName) {
    program.addonName = addonName;
  })
  .option('-u, --username <username>', 'GitHub username')
  .option('-p, --password <password>', 'GitHub password')
  .parse(process.argv);

var options = {
  addonName: dasherize(program.addonName),
  username: program.username,
  password: program.password
};

return validateOptions(options)
  .then(run)
  .catch(ui.error);
