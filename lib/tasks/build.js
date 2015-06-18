/*jshint node:true*/
'use strict';

var fs = require('fs-extra');
var path = require('path');

var ui = require('../ui');
var Promise = require('../ext/promise');
var copyFiles = require('../utils/copy-files');

var readFile = Promise.denodeify(fs.readFile);

// common

function determineMicroAddonType(microAddon) {
  return readFile(path.join(microAddon.path, 'package.json')).then(function(fileContent) {
    var packageInfo = JSON.parse(fileContent);
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

function writeIndexJs(microAddon) {

  var indexFile = fs.createOutputStream(path.join(microAddon.path, 'dist', 'index.js'));
  indexFile.write('\/* jshint node: true */\n');
  indexFile.write('\n');
  indexFile.write('module.exports = {\n');
  indexFile.write('  name: \'' + microAddon.name + '\'\n');
  indexFile.write('};\n');
  indexFile.end();

  return Promise.resolve();
}

function buildMicroAddon(microAddon, type) {
  if (type === 'helper')  {
    return buildMicroHelper(microAddon);
  } else if (type === 'library') {
    return buildMicroLibrary(microAddon);
  } else if (type === 'component') {
    return buildMicroComponent(microAddon);
  }
}

// helper

function getHelperMappings(microAddon) {
  return [
    {
      oldPath: path.join(microAddon.path, 'package.json'),
      newPath: path.join(microAddon.path, 'dist', 'package.json')
    },
    {
      oldPath: path.join(microAddon.path, 'helper.js'),
      newPath: path.join(microAddon.path, 'dist', 'app', 'helpers', microAddon.name + '.js')
    }
  ];
}

function buildMicroHelper(microAddon) {
  ui.write('Packaging helper...', microAddon.name);
  var fileMappings = getHelperMappings(microAddon);
  return copyFiles(fileMappings).then(function() {
    return writeIndexJs(microAddon);
  });
}

// library

function getLibraryMappings(microAddon) {
  return [
    {
      oldPath: path.join(microAddon.path, 'package.json'),
      newPath: path.join(microAddon.path, 'dist', 'package.json')
    },
    {
      oldPath: path.join(microAddon.path, 'library.js'),
      newPath: path.join(microAddon.path, 'dist', 'app', 'lib', microAddon.name + '.js')
    }
  ];
}

function buildMicroLibrary(microAddon) {
  ui.write('Packaging library...', microAddon.name);
  var fileMappings = getLibraryMappings(microAddon);
  return copyFiles(fileMappings).then(function() {
    return writeIndexJs(microAddon);
  });
}

// component

function getComponentMappings(microAddon) {
  return [
    {
      oldPath: path.join(microAddon.path, 'package.json'),
      newPath: path.join(microAddon.path, 'dist', 'package.json')
    },
    {
      oldPath: path.join(microAddon.path, 'component.js'),
      newPath: path.join(microAddon.path, 'dist', 'app', 'components', microAddon.name + '.js')
    },
    {
      oldPath: path.join(microAddon.path, 'template.hbs'),
      newPath: path.join(microAddon.path, 'dist', 'app', 'templates', 'components', microAddon.name + '.hbs')
    },
    {
      oldPath: path.join(microAddon.path, 'style.css'),
      newPath: path.join(microAddon.path, 'dist', 'addon', 'styles', microAddon.name + '.css')
    }
  ];
}

function buildMicroComponent(microAddon) {
  ui.write('Packaging component...', microAddon.name);
  var fileMappings = getComponentMappings(microAddon);
  return copyFiles(fileMappings).then(function() {
    return writeIndexJs(microAddon);
  });
}

module.exports = function(options) {
  var microAddon = { name: options.name, path: path.join(process.cwd(), options.name) };

  return determineMicroAddonType(microAddon).then(function(type) {
    return buildMicroAddon(microAddon, type);
	});
};
