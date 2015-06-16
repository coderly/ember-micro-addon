#! /usr/bin/env node

if (process.argv.length < 3) {
  console.error("You must provide a name for the library");
} else {
  require('../tasks/library')([process.argv[2]], this.project)
    .finally(process.exit);
}
