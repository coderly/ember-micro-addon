#! /usr/bin/env node

require('../commands/publish').validateAndRun([process.argv[2]])
  .catch(console.error)
  .finally(process.exit);
