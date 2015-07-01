/*jshint node:true*/
'use strict';

var path = require('path');
var ui = require('../ui');
var extractAddon = require('../utils/extract-addon');

var placeholder = '<%= libraryName %>';
var blueprintName = 'micro-library';

var fileList = ['index.js', 'package.json', 'library.js'];

var fileMappings = [
  {
    appFile: path.join('app', 'lib', placeholder + '.js'),
    addonFile: 'library.js'
  }
];

module.exports = function(options) {
  ui.write('Extracting library ' + options.addonName + ' into ../' + options.addonName);

  options.blueprintName = blueprintName;
  options.placeholder = placeholder;
  options.fileList = fileList;
  options.fileMappings = fileMappings;

  return extractAddon(options).then(function() {
    return ui.write('Library extraction successful!');
  });
};
