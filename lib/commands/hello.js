module.exports = {
  name: 'micro:hello',
  description: 'Outputs "Hello world"',
  works: 'everywhere',

  validateAndRun: function(rawArgs) {
    return this.run({}, rawArgs);
  },

  run: function(options, rawArgs) {
    return require('../tasks/hello')(rawArgs, this.project)();
  }
};
