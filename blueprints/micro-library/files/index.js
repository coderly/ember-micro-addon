/* jshint node: true */
'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');

module.exports = {
  name: '<%= libraryName %>',

  treeForApp: function() {
    return this.buildTree(this.root, ['library.js']);
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
    if (relativePath === 'library.js') {
      return path.join('lib', this.name + '.js');
    }
  }
};
