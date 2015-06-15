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

  console.log('writing index', microAddon.path, microAddon.name);
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
  console.log('copying package.json', microAddon.path, microAddon.name);
  var oldPackageJson = path.join(microAddon.path, 'package.json');
  var newPackageJson = path.join(microAddon.path, 'dist', 'package.json');
  return copy(oldPackageJson, newPackageJson, { clobber: true }).then(function() {
    console.log(microAddon.path, microAddon.name);
    return Promise.resolve(microAddon);
  });
}

function copyHelperJs(microAddon) {
  console.log('copying helper.js', microAddon.path, microAddon.name);
  var oldHelper = path.join(microAddon.path, 'helper.js');
  var newHelper = path.join(microAddon.path, 'dist', 'app', 'helpers', microAddon.name + '.js');
  return copy(oldHelper, newHelper, { clobber: true });
}

function packHelper(microAddon) {
  console.log('Packaging helper...', microAddon.name);
  return copyPackageJson(microAddon).then(writeIndexJs).then(copyHelperJs);
}

function packLibrary(microAddon) {
  console.log('Packaging library...', microAddon);
}

function packComponent(microAddonPath) {
  console.log('Packaging component...', microAddon);
}

function pack(microAddon, type) {
  if (type === 'helper')  {
    return packHelper(microAddon);
  } else if (type === 'library') {
    return packLibrary(microAddon);
  } else if (type === 'component') {
    return packComponent(microAddon);
  }
}

module.exports = function(rawArgs, project) {

  console.log('process', process.cwd());
  console.log('project', project.root);

  var microAddon = {
    name: rawArgs[0],
    path: path.join(project.root, rawArgs[0])
  };

  if (microAddon.name) {
    return readFile(path.join(microAddon.path, 'package.json'))
    .then(determineMicroAddonType)
    .then(function(type) {
      return pack(microAddon, type);
  	});

  } else {
    return Promise.reject(new Error('A "name" parameter is required to generate a micro-library'));
  }
};
