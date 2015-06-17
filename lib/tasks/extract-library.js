/*jshint node:true*/
'use strict';

var PLACEHOLDER = '<%= libraryName %>';

var Promise = require('../ext/promise');
var fs = require('fs-extra');
var path = require('path');
var ui = require('../ui');


var ensureDir = Promise.denodeify(fs.ensureDir);
var copy = Promise.denodeify(fs.copy);
var readFile = Promise.denodeify(fs.readFile);
var writeFile = Promise.denodeify(fs.writeFile);

function createAddonFolder(name) {
  return ensureDir(path.join('addon', name)).then(function() {
    return Promise.resolve(name);
  });
}

function copyBlueprintFiles(name) {
  var blueprintName = "micro-library";
  var blueprintFolderRelativePath = "../../blueprints";
  var blueprintPath = path.resolve(__dirname, blueprintFolderRelativePath, blueprintName);

  var srcPath = path.join(blueprintPath, 'files');
  var destPath = path.join('addon', name);

  return copy(srcPath, destPath).then(function() {
    return Promise.resolve(name);
  });
}

function replaceInFile(file, placeholder, value) {
  return readFile(file, { encoding: 'utf-8' }).then(function(data) {
    var data = data.replace(placeholder, value);
    return writeFile(file, data);
  });
}

function insertAddonName(name) {
  var indexJsFile = path.join('addon', name, 'index.js');
  var packageJsonFile = path.join('addon', name, 'package.json');
  return replaceInFile(indexJsFile, PLACEHOLDER, name).then(function() {
    return replaceInFile(packageJsonFile, PLACEHOLDER, name);
  }).then(function() {
    return Promise.resolve(name);
  });
}

function overwriteLibraryJs(name) {
  var oldLibrary = path.join('app', 'lib', name + '.js');
  var newLibrary = path.join('addon', name, 'library.js');
  return copy(oldLibrary, newLibrary, { clobber: true }).then(function() {
    return Promise.resolve(name);
  });
}

module.exports = function(name) {
  ui.start('Extracting library ' + name + ' into addon/' + name + '\n');

  return createAddonFolder(name)
  .then(copyBlueprintFiles)
  .then(insertAddonName)
  .then(overwriteLibraryJs)
  .then(function() {
    ui.write('Succesfully extracted library\n');
    return Promise.resolve();
  })
};
