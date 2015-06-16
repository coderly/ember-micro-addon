module.exports = {
  name: 'micro:library',
  description: 'Creates files required for a micro-library to work',
  works: 'outsideProject',

  validateAndRun: function(rawArgs) {
    return this.run({}, rawArgs);
  },

  run: function(options, rawArgs) {
    return require('../tasks/library')(rawArgs);
  }
};
