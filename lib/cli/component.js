#! /usr/bin/env node

var ui = require('../ui');

require('../commands/component').validateAndRun([process.argv[2]])
  .catch(ui.error)
  .finally(process.exit);