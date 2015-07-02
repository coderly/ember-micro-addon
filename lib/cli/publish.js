#! /usr/bin/env node

var program = require('commander');
var cliPrompt = require('prompt');

var dasherize = require('../utils/string').dasherize;
var ui = require('../ui');

cliPrompt.message = '';
cliPrompt.delimiter = '';

var promptSchema = {
  properties: {
    username: {
      description: 'GitHub username: ',
      message: 'A username is required.',
      required: true
    },
    password: {
      description: 'GitHub password: ',
      message: 'A password is required.',
      required: true,
      hidden: true
    }
  }
};

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

function runPublishTask() {
  require('../tasks/publish')({
    addonName: dasherize(program.addonName),
    username: program.username,
    password: program.password
  }).catch(ui.error);
}

if (program.addonName) {
  if(program.username && program.password) {
    runPublishTask();
  } else {
    cliPrompt.start();
    cliPrompt.get(promptSchema, function(error, result) {
      if (error) {
        return ui.error(error);
      } else {
        program.username = result.username;
        program.password = result.password;
        runPublishTask();
      }
    });
  }
} else {
  program.outputHelp();
}
