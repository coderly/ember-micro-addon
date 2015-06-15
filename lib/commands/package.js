module.exports = {
  name: 'micro:package',
  description: 'Packages an ember-micro-addon into a proper ember-addon',
  works: 'outsideProject',

  validateAndRun: function(rawArgs) {
    return this.run({}, rawArgs);
  },

  run: function(options, rawArgs) {
    return require('../tasks/package')(rawArgs, this.project);
  }
};
