module.exports = {
  name: 'micro:component',
  description: 'Creates files required for a micro-component to work',
  works: 'insideProject',

  validateAndRun: function(rawArgs) {
    return this.run({}, rawArgs);
  },

  run: function(options, rawArgs) {
    return require('../tasks/component')(rawArgs, this.project)();
  }
};
