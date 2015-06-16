#! /usr/bin/env node

require('../commands/helper').validateAndRun([process.argv[2]])
	.catch(console.error)
	.finally(process.exit);