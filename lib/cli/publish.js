#! /usr/bin/env node

var program = require('commander');

var dasherize = require('../utils/string').dasherize;
var ui = require('../ui');

program
  .arguments('<addonName>')
  .usage('<addonName> -u <username> -p <password>')
  .option('-u, --username <username>', 'GitHub username')
  .option('-p, --password <password>', 'GitHub password')
  .action(function(addonName) {
    if (addonName) {
      program.addonName = addonName;
    }
  });

program
  .parse(process.argv);

if (program.addonName && program.username && program.password) {
  require('../tasks/publish')({
    addonName: dasherize(program.addonName),
    username: program.username,
    password: program.password
  }).catch(ui.error);
} else {
  program.outputHelp();
}
