/*jshint node:true*/
'use strict';

var Promise = require('../ext/promise');
var fs = require('fs-extra');
var path = require('path');
var copy = Promise.denodeify(fs.copy);
var readFile = Promise.denodeify(fs.readFile);

function determineMicroAddonType(packageJsonContent) {
  var packageInfo = JSON.parse(packageJsonContent);
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
}

function writeIndexJs(microAddon) {

  var indexFile = fs.createOutputStream(path.join(microAddon.path, 'dist', 'index.js'));
  indexFile.write('\/* jshint node: true */\n');
  indexFile.write('\n');
  indexFile.write('module.exports = {\n');
  indexFile.write('  name: \'' + microAddon.name + '\'\n');
  indexFile.write('};\n');
  indexFile.end();

  return Promise.resolve(microAddon);
}

function copyPackageJson(microAddon) {
  var oldPackageJson = path.join(microAddon.path, 'package.json');
  var newPackageJson = path.join(microAddon.path, 'dist', 'package.json');
  return copy(oldPackageJson, newPackageJson, { clobber: true }).then(function() {
    return Promise.resolve(microAddon);
  });
}

function copyHelperJs(microAddon) {
  var oldHelper = path.join(microAddon.path, 'helper.js');
  var newHelper = path.join(microAddon.path, 'dist', 'app', 'helpers', microAddon.name + '.js');
  return copy(oldHelper, newHelper, { clobber: true }).then(function() {
    return Promise.resolve(microAddon);
  });
}

function copyLibraryJs(microAddon) {
  var oldLibrary = path.join(microAddon.path, 'library.js');
  var newLibrary = path.join(microAddon.path, 'dist', 'app', 'lib', microAddon.name + '.js');
  return copy(oldLibrary, newLibrary, { clobber: true }).then(function() {
    return Promise.resolve(microAddon);
  });
}

function copyComponentJs(microAddon) {
  var oldComponent = path.join(microAddon.path, 'component.js');
  var newComponent = path.join(microAddon.path, 'dist', 'app', 'components', microAddon.name + '.js');
  return copy(oldComponent, newComponent, { clobber: true }).then(function() {
    return Promise.resolve(microAddon);
  });
}

function copyComponentTemplate(microAddon) {
  var oldTemplate = path.join(microAddon.path, 'template.hbs');
  var newTemplate = path.join(microAddon.path, 'dist', 'app', 'templates', 'components', microAddon.name + '.hbs');
  return copy(oldTemplate, newTemplate, { clobber: true}).then(function() {
    return Promise.resolve(microAddon);
  });
}

function copyComponentStyle(microAddon) {
  var oldStyle = path.join(microAddon.path, 'style.css');
  var newStyle = path.join(microAddon.path, 'dist', 'addon', 'styles', microAddon.name + '.css');
  return copy(oldStyle, newStyle, { clobber: true }).then(function() {
    return Promise.resolve(microAddon);
  });
}

function buildMicroHelper(microAddon) {
  console.log('Packaging helper...', microAddon.name);
  return copyPackageJson(microAddon)
    .then(writeIndexJs)
    .then(copyHelperJs);
}

function buildMicroLibrary(microAddon) {
  console.log('Packaging library...', microAddon.name);
  return copyPackageJson(microAddon)
    .then(writeIndexJs)
    .then(copyLibraryJs);
}

function buildMicroComponent(microAddon) {
  console.log('Packaging component...', microAddon.name);
  return copyPackageJson(microAddon)
    .then(writeIndexJs)
    .then(copyComponentJs)
    .then(copyComponentTemplate)
    .then(copyComponentStyle);
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

module.exports = function(rawArgs) {
  var name = rawArgs[0];

  if (name) {
    var microAddon = { name: name, path: path.join(process.cwd(), name) };

    return readFile(path.join(microAddon.path, 'package.json'))
      .then(determineMicroAddonType)
      .then(function(type) {
        return buildMicroAddon(microAddon, type);
    	});

  } else {
    return Promise.reject(new Error('A "name" parameter is required to build a micro-addon'));
  }
};
