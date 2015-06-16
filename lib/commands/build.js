var dasherize = require('../utils/string').dasherize;
var Promise = require('../ext/promise');

module.exports = {
  name: 'micro:build',
  description: 'Packages an ember-micro-addon into a proper ember-addon',
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
    return require('../tasks/build')(options);
  }
};
