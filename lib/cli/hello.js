#! /usr/bin/env node

require('../commands/hello').validateAndRun([process.argv[2]])
	.catch(console.error)
	.finally(process.exit);