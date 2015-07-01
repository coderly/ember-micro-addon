/*jshint node:true*/
'use strict';

var path = require('path');
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

module.exports = function(options) {
  ui.write('Extracting component ' + options.addonName + ' into ../' + options.addonName);

  options.blueprintName = blueprintName;
  options.placeholder = placeholder;
  options.fileList = fileList;
  options.fileMappings = fileMappings;

  return extractAddon(options).then(function() {
    return ui.write('Component extraction successful!');
  });
};
