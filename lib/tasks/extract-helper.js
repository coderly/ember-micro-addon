/*jshint node:true*/
'use strict';

var path = require('path');
var ui = require('../ui');
var extractAddon = require('../utils/extract-addon');

var placeholder = '<%= helperName %>';
var blueprintName = 'micro-helper';

var fileList = ['index.js', 'package.json', 'helper.js'];

var fileMappings = [
  {
    appFile: path.join('app', 'helpers', placeholder + '.js'),
    addonFile: 'helper.js'
  }
];

module.exports = function(options) {
  ui.write('Extracting helper ' + options.addonName + ' into ' + options.destination);

  options.blueprintName = blueprintName;
  options.placeholder = placeholder;
  options.fileList = fileList;
  options.fileMappings = fileMappings;

  return extractAddon(options).then(function() {
    return ui.write('Helper extraction successful!');
  });
};
