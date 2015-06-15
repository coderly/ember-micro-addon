module.exports = {
  description: 'The default blueprint for ember-cli micro-addon component.',

  locals: function(options) {
    var componentEntity    = options.entity;
    var componentName   = componentEntity.name;

    return {
      componentName: componentName,
      emberCLIVersion: require('../../package').version,
    };
  },
};
