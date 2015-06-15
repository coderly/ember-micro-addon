/* jshint node: true */
'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');

module.exports = {
  name: '<%= helperName %>',

  treeForApp: function() {
    return this.buildTree(this.root, ['helper.js']);
  },

  buildTree: function(sourceTree, includedFiles) {
    var addon = this;

    return new Funnel(sourceTree, {
      include: includedFiles,
      getDestinationPath: function(relativePath) {
        return addon.mapFile(relativePath);
      }
    });
  },

  mapFile: function(relativePath) {
    if (relativePath === 'helper.js') {
      return path.join('helpers', this.name + '.js');
    }
  }
};
