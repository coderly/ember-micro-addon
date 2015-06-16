#! /usr/bin/env node

require('../commands/component').validateAndRun([process.argv[2]])
  .catch(console.error)
  .finally(process.exit);