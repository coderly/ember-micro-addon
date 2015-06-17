var dasherize = require('../utils/string').dasherize;
var Promise = require('../ext/promise');

module.exports = {
  name: 'micro:extract',
  description: 'Extracts entities from an existing app into a micro-addon folder',
  works: 'outsideProject',

  validateAndRun: function(rawArgs) {
    var options = {
      type: rawArgs[0],
      name: rawArgs[1]
    };
    return this.validateType(options).then(this.validateName).then(this.run);
  },

  validateType: function(options) {
    return new Promise(function(resolve, reject) {
      if (options.type) {
        resolve(options);
      } else {
        reject('You must provide the type of the entity to extract');
      }
    });
  },

  validateName: function(options) {
    return new Promise(function(resolve, reject) {
      if (options.name) {
        resolve(options);
      } else {
        reject('You must provide the name of the entity to extract');
      }
    });
  },

  run: function(options) {
    if (options.type === 'library') {
      return require('../tasks/extract-library')(dasherize(options.name));
    } else if (options.type === 'helper') {
      return require('../tasks/extract-helper')(dasherize(options.name));
    } else {
      return Promise.reject('Something went wrong.');
    }
  }
};
