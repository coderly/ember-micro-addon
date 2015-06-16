var dasherize = require('../utils/string').dasherize;
var Promise = require('../ext/promise');

module.exports = {
  name: 'micro:helper',
  description: 'Creates files required for a micro-helper to work',
  works: 'outsideProject',

  validateAndRun: function(rawArgs) {
    var name = rawArgs[0];
    if (name) {
      return this.run({ name: dasherize(name) });
    } else {
      return Promise.reject('You must provide a name.');
    }
  },

  run: function(options) {
    return require('../tasks/helper')(options);
  }
};
