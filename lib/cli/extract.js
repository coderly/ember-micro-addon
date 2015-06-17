#! /usr/bin/env node

require('../commands/extract').validateAndRun([process.argv[2], process.argv[3]])
  .catch(console.error)
  .finally(process.exit);
