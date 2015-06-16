#! /usr/bin/env node

if (process.argv.length < 3) {
  console.error("You must provide a name for the helper");
} else {
  require('../tasks/helper')([process.argv[2]], this.project)
    .finally(process.exit);
}
