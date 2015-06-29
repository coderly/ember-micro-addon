/*jshint node:true*/
'use strict';

var fs = require('fs-extra');
var path = require('path');

var ui = require('../ui');
var Promise = require('../ext/promise');
var copyFiles = require('../utils/copy-files');

var readJson = Promise.denodeify(fs.readJson);

// helper

function getHelperMappings(options) {
  return [
    {
      oldPath: path.join(options.workingDirectory, 'package.json'),
      newPath: path.join(options.workingDirectory, 'dist', 'package.json')
    },
    {
      oldPath: path.join(options.workingDirectory, 'helper.js'),
      newPath: path.join(options.workingDirectory, 'dist', 'app', 'helpers', options.addonName + '.js')
    }
  ];
}

function buildMicroHelper(options) {
  ui.write('Packaging helper...', options.addonName);
  var fileMappings = getHelperMappings(options);
  return copyFiles(fileMappings).then(function() {
    return writeIndexJs(options);
  });
}

// library

function getLibraryMappings(options) {
  return [
    {
      oldPath: path.join(options.workingDirectory, 'package.json'),
      newPath: path.join(options.workingDirectory, 'dist', 'package.json')
    },
    {
      oldPath: path.join(options.workingDirectory, 'library.js'),
      newPath: path.join(options.workingDirectory, 'dist', 'app', 'lib', options.addonName + '.js')
    }
  ];
}

function buildMicroLibrary(options) {
  ui.write('Packaging library...', options.addonName);
  var fileMappings = getLibraryMappings(options);
  return copyFiles(fileMappings).then(function() {
    return writeIndexJs(options);
  });
}

// component

function getComponentMappings(options) {
  return [
    {
      oldPath: path.join(options.workingDirectory, 'package.json'),
      newPath: path.join(options.workingDirectory, 'dist', 'package.json')
    },
    {
      oldPath: path.join(options.workingDirectory, 'component.js'),
      newPath: path.join(options.workingDirectory, 'dist', 'app', 'components', options.addonName + '.js')
    },
    {
      oldPath: path.join(options.workingDirectory, 'template.hbs'),
      newPath: path.join(options.workingDirectory, 'dist', 'app', 'templates', 'components', options.addonName + '.hbs')
    },
    {
      oldPath: path.join(options.workingDirectory, 'style.css'),
      newPath: path.join(options.workingDirectory, 'dist', 'addon', 'styles', options.addonName + '.css')
    }
  ];
}

function buildMicroComponent(options) {
  ui.write('Packaging component...', options.addonName);
  var fileMappings = getComponentMappings(options);
  return copyFiles(fileMappings).then(function() {
    return writeIndexJs(options);
  });
}

// common

function determineMicroAddonType(options) {
  return readJson(path.join(options.workingDirectory, 'package.json')).then(function(packageInfo) {
    var addonType;

    if (packageInfo.keywords) {
      if (packageInfo.keywords.indexOf('ember-micro-component') >= 0) {
        addonType = 'component';
      } else if (packageInfo.keywords.indexOf('ember-micro-helper') >= 0) {
        addonType = 'helper';
      } else if (packageInfo.keywords.indexOf('ember-micro-library') >= 0) {
        addonType = 'library';
      }
    }

    return addonType;
  });
}

function writeIndexJs(options) {

  var indexFile = fs.createOutputStream(path.join(options.workingDirectory, 'dist', 'index.js'));
  indexFile.write('\/* jshint node: true */\n');
  indexFile.write('\n');
  indexFile.write('module.exports = {\n');
  indexFile.write('  name: \'' + options.addonName + '\'\n');
  indexFile.write('};\n');
  indexFile.end();

  return Promise.resolve();
}

function buildMicroAddon(options, type) {
  if (type === 'helper')  {
    return buildMicroHelper(options);
  } else if (type === 'library') {
    return buildMicroLibrary(options);
  } else if (type === 'component') {
    return buildMicroComponent(options);
  }
}

module.exports = function(options) {
  options.workingDirectory = path.join(process.cwd(), options.addonName);

  return determineMicroAddonType(options).then(function(type) {
    return buildMicroAddon(options, type);
	});
};
