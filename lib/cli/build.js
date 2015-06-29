#! /usr/bin/env node

var ui = require('../ui');

require('../commands/build').validateAndRun([process.argv[2]])
  .catch(ui.error)
  .finally(process.exit);
