/*jshint node:true*/
'use strict';

var path = require('path');
var Promise = require('../ext/promise');
var ui = require('../ui');
var extractAddon = require('../utils/extract-addon');

var placeholder = '<%= componentName %>';
var blueprintName = 'micro-component';

var fileList = ['index.js', 'package.json', 'style.css', 'template.hbs', 'component.js'];

var fileMappings = [
  {
    appFile: path.join('app', 'components', placeholder + '.js'),
    addonFile: 'component.js'
  },
  {
    appFile: path.join('app', 'templates', 'components', placeholder + '.hbs'),
    addonFile: 'template.hbs'
  },
  {
    appFile: path.join('app', 'styles', placeholder + '.css'),
    addonFile: 'style.css'
  }
];

module.exports = function(addonName) {
  ui.write('Extracting component ' + addonName + ' into ../' + addonName);

  var options = {
    addonName: addonName,
    blueprintName: blueprintName,
    placeholder: placeholder,
    fileList: fileList,
    fileMappings: fileMappings
  };

  return extractAddon(options).then(function() {
    ui.write('Succesfully extracted component');
    return Promise.resolve();
  });
};
