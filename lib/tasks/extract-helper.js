/*jshint node:true*/
'use strict';

var Promise = require('../ext/promise');
var path = require('path');
var ui = require('../ui');
var extractAddon = require('../utils/extract-addon');

var placeholder = '<%= helperName %>';
var blueprintName = 'micro-helper';

var fileList = ['index.js', 'package.json', 'helper.js']

var fileMappings = [
  {
    appFile: path.join('app', 'helpers', placeholder + '.js'),
    addonFile: 'helper.js'
  }
]

module.exports = function(addonName) {
  ui.write('Extracting helper ' + addonName + ' into ../' + addonName);

  var options = {
    addonName: addonName,
    blueprintName: blueprintName,
    placeholder: placeholder,
    fileList: fileList,
    fileMappings: fileMappings
  };

  return extractAddon(options).then(function() {
    ui.write('Succesfully extracted helper');
    return Promise.resolve();
  });
};
