/* jshint node: true */
'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');

module.exports = {
  name: '<%= componentName %>',

  treeForApp: function() {
    return this.buildTree(this.root, ['component.js']);
  },

  treeForTemplates: function() {
    return this.buildTree(this.root, ['template.hbs']);
  },

  treeForAddon: function() {
    return this.buildTree(this.root, ['style.css']);
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
    if (relativePath === 'component.js') {
      return path.join('components', this.name + '.js');
    } else if (relativePath === 'template.hbs') {
      return path.join('components', this.name + '.hbs');
    } else if (relativePath === 'style.css') {
      return path.join('addon/styles', this.name + '.css');
    }
  }
};
