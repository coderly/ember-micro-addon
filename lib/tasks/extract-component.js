/*jshint node:true*/
'use strict';

var PLACEHOLDER = '<%= componentName %>';

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
  var blueprintName = "micro-component";
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
  var styleCssFile = path.join('addon', name, 'style.css');
  return replaceInFile(indexJsFile, PLACEHOLDER, name).then(function() {
    return replaceInFile(packageJsonFile, PLACEHOLDER, name);
  }).then(function() {
    return replaceInFile(styleCssFile, PLACEHOLDER, name);
  }).then(function() {
    return Promise.resolve(name);
  });
}

function copyFileIfExists(oldFile, newFile) {
  return new Promise(function(resolve) {
    copy(oldFile, newFile, { clobber: true }).finally(resolve);
  });
}

function overwriteComponentJs(name) {
  var oldFile = path.join('app', 'components', name + '.js');
  var newFile = path.join('addon', name, 'component.js');
  return copyFileIfExists(oldFile, newFile).then(function() {
    return Promise.resolve(name);
  });
}

function overwriteTemplateHbs(name) {
  var oldFile = path.join('app', 'templates/components', name + '.hbs');
  var newFile = path.join('addon', name, 'template.hbs');
  return copyFileIfExists(oldFile, newFile).then(function() {
    return Promise.resolve(name);
  });
}

function overwriteTemplateHbs(name) {
  var oldFile = path.join('app', 'styles', name + '.css');
  var newFile = path.join('addon', name, 'style.css');
  return copyFileIfExists(oldFile, newFile).then(function() {
    return Promise.resolve(name);
  });
}

module.exports = function(name) {
  ui.start('Extracting component ' + name + ' into addon/' + name + '\n');

  return createAddonFolder(name)
  .then(copyBlueprintFiles)
  .then(insertAddonName)
  .then(overwriteComponentJs)
  .then(overwriteTemplateHbs)
  .then(function() {
    ui.write('Succesfully extracted component\n');
    return Promise.resolve();
  });
};
