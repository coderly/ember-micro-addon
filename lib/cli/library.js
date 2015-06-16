#! /usr/bin/env node

require('../commands/library').validateAndRun([process.argv[2]])
  .catch(console.error)
  .finally(process.exit);