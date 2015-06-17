/*jshint node:true*/
'use strict';

var PLACEHOLDER = '<%= helperName %>';

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
  var blueprintName = "micro-helper";
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
    var modifiedData = data.replace(placeholder, value);
    return writeFile(file, modifiedData);
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

function overwriteHelperJs(name) {
  var oldPath = path.join('app', 'helpers', name + '.js');
  var newPath = path.join('addon', name, 'helper.js');
  return copy(oldPath, newPath, { clobber: true }).then(function() {
    return Promise.resolve(name);
  });
}

module.exports = function(name) {
  ui.start('Extracting helper ' + name + ' into addon/' + name + '\n');

  return createAddonFolder(name)
  .then(copyBlueprintFiles)
  .then(insertAddonName)
  .then(overwriteHelperJs)
  .then(function() {
    ui.write('Succesfully extracted helper\n');
    return Promise.resolve();
  });
};
