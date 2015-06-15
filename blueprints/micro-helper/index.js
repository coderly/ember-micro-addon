module.exports = {
  description: 'The default blueprint for ember-cli micro-addon helper.',

  locals: function(options) {
    var helperEntity    = options.entity;
    var helperName   = helperEntity.name;

    return {
      helperName: helperName,
      emberCLIVersion: require('../../package').version,
    };
  },
};
