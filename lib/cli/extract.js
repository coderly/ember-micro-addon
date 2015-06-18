#! /usr/bin/env node

var ui = require('../ui');

require('../commands/extract').validateAndRun([process.argv[2], process.argv[3]])
  .catch(ui.error)
  .finally(process.exit);
