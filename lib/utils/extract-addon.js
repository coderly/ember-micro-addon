/*globals __dirname*/

var fs = require('fs-extra');
var path = require('path');

var Promise = require('../ext/promise');
var overwriteFiles = require('./overwrite-files');

var ensureDir = Promise.denodeify(fs.ensureDir);
var copy = Promise.denodeify(fs.copy);
var readFile = Promise.denodeify(fs.readFile);
var writeFile = Promise.denodeify(fs.writeFile);

function createAddonFolder(name) {
  return ensureDir(path.join('addon', name));
}

function copyBlueprintFiles(name, blueprintName) {
  var blueprintFolderRelativePath = "../../blueprints";
  var blueprintPath = path.resolve(__dirname, blueprintFolderRelativePath, blueprintName);

  var srcPath = path.join(blueprintPath, 'files');
  var destPath = path.join('addon', name);

  return copy(srcPath, destPath);
}

function replaceInFile(file, placeholder, value) {
  return readFile(file, { encoding: 'utf-8' }).then(function(data) {
    var modifiedData = data.replace(placeholder, value);
    return writeFile(file, modifiedData);
  });
}

function replaceInFiles(files, placeholder, value) {
  return Promise.map(files, function(file) {
    return replaceInFile(file, placeholder, value);
  });
}

module.exports = function(options) {
  return createAddonFolder(options.addonName).then(function() {
    return copyBlueprintFiles(options.addonName, options.blueprintName);
  }).then(function() {
    return replaceInFiles(options.filesToReplacePlaceholderIn, options.placeholder, options.addonName);
  }).then(function () {
    return overwriteFiles(options.fileMappings);
  });
};