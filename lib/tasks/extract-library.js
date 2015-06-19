/*jshint node:true*/
'use strict';

var Promise = require('../ext/promise');
var path = require('path');
var ui = require('../ui');
var extractAddon = require('../utils/extract-addon');

var placeholder = '<%= libraryName %>';
var blueprintName = 'micro-library';

var fileList = ['index.js', 'package.json', 'library.js']

var fileMappings = [
  {
    appFile: path.join('app', 'lib', placeholder + '.js'),
    addonFile: 'library.js'
  }
]

module.exports = function(addonName) {
  ui.write('Extracting library ' + addonName + ' into ../' + addonName);

  var options = {
    addonName: addonName,
    blueprintName: blueprintName,
    placeholder: placeholder,
    fileList: fileList,
    fileMappings: fileMappings
  };

  return extractAddon(options).then(function() {
    ui.write('Succesfully extracted library');
    return Promise.resolve();
  });
};
