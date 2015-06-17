/*jshint node:true*/
'use strict';

var Promise = require('../ext/promise');
var path = require('path');
var ui = require('../ui');
var extractAddon = require('../utils/extract-addon');

function getFilesWithPlaceholdersFromName(name) {
  return [
    path.join('addon', name, 'index.js'),
    path.join('addon', name, 'package.json'),
  ];
}

function getFileMappingsFromName(name) {
  return [
    {
      oldPath: path.join('app', 'lib', name + '.js'),
      newPath: path.join('addon', name, 'library.js')
    }
  ];
}

module.exports = function(name) {
  ui.start('Extracting library ' + name + ' into addon/' + name + '\n');

  var options = {
    addonName: name,
    blueprintName: 'micro-library',
    placeholder: '<%= libraryName %>',
    filesToReplacePlaceholderIn: getFilesWithPlaceholdersFromName(name),
    fileMappings: getFileMappingsFromName(name)
  }

  return extractAddon(options).then(function() {
    ui.write('Succesfully extracted library\n');
    return Promise.resolve();
  });
};
