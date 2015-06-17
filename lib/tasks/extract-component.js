/*jshint node:true*/
'use strict';

var path = require('path');
var Promise = require('../ext/promise');
var ui = require('../ui');
var extractAddon = require('../utils/extract-addon');

function getFilesWithPlaceholdersFromName(name) {
  return [
    path.join('addon', name, 'index.js'),
    path.join('addon', name, 'package.json'),
    path.join('addon', name, 'style.css')
  ];
}

function getFileMappingsFromName(name) {
  return [
    {
      oldPath: path.join('app', 'components', name + '.js'),
      newPath: path.join('addon', name, 'component.js')
    },
    {
      oldPath: path.join('app', 'templates/components', name + '.hbs'),
      newPath: path.join('addon', name, 'template.hbs')
    },
    {
      oldPath: path.join('app', 'styles', name + '.css'),
      newPath: path.join('addon', name, 'style.css')
    }
  ];
}

module.exports = function(name) {
  ui.start('Extracting component ' + name + ' into addon/' + name + '\n');

  var options = {
    addonName: name,
    blueprintName: 'micro-component',
    placeholder: '<%= componentName %>',
    filesToReplacePlaceholderIn: getFilesWithPlaceholdersFromName(name),
    fileMappings: getFileMappingsFromName(name)
  }

  return extractAddon(options).then(function() {
    ui.write('Succesfully extracted component\n');
    return Promise.resolve();
  });
};
