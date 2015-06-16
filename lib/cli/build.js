#! /usr/bin/env node

require('../commands/build').validateAndRun([process.argv[2]])
  .catch(console.error)
  .finally(process.exit);
