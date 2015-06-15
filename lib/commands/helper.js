module.exports = {
  name: 'micro:helper',
  description: 'Creates files required for a micro-helper to work',
  works: 'outsideProject',

  validateAndRun: function(rawArgs) {
    return this.run({}, rawArgs);
  },

  run: function(options, rawArgs) {
    return require('../tasks/helper')(rawArgs, this.project);
  }
};
