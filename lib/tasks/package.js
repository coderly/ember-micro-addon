/*jshint node:true*/
'use strict';

var Promise = require('../ext/promise');
var runCommand = require('../utils/run-command');
var fs = require('fs');
var path = require('path');
var rmdir = Promise.denodeify(fs.rmdir);
var mkdir = Promise.denodeify(fs.mkdir);
var rename =  Promise.denodeify(fs.rename);
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

function packHelper(microAddonPath) {
  console.log('Packaging helper...', microAddonPath);
}

function packLibrary(microAddonPath) {
  console.log('Packaging library...', microAddonPath);
}

function packComponent(microAddonPath) {
  console.log('Packaging component...', microAddonPath);
}

function pack(microAddonPath, type) {
  if (type === 'helper')  {
    return packHelper(microAddonPath);
  } else if (type === 'library') {
    return packLibrary(microAddonPath);
  } else if (type === 'component') {
    return packComponent(microAddonPath);
  }
}

module.exports = function(rawArgs, project) {

  var name = rawArgs[0];
  var microAddonPath = path.join(project.root, name);
  if (name) {
    return readFile(path.join(microAddonPath, 'package.json'))
    .then(determineMicroAddonType)
    .then(function(type) {
      return pack(microAddonPath, type);
  	});

  } else {
    return Promise.reject(new Error('A "name" parameter is required to generate a micro-library'));
  }

};
