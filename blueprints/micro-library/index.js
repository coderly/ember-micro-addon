module.exports = {
  description: 'The default blueprint for ember-cli micro-addon library.',

  locals: function(options) {
    var libraryEntity = options.entity;
    var libraryName = libraryEntity.name;

    return {
      libraryName: libraryName,
      emberCLIVersion: require('../../package').version,
    };
  },
};
