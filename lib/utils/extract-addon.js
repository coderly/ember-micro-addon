/*globals __dirname*/

var fs = require('fs-extra');
var path = require('path');

var Promise = require('../ext/promise');

var ensureDir = Promise.denodeify(fs.ensureDir);
var copy = Promise.denodeify(fs.copy);
var readFile = Promise.denodeify(fs.readFile);
var writeFile = Promise.denodeify(fs.writeFile);

function getDefaultExtractDestination(addonName) {
  return path.resolve(path.join('..', addonName));
}

function getExtractDestination(options) {
  return options.extractDestination || getDefaultExtractDestination(options.addonName);
}

function createAddonFolder(options) {
  return ensureDir(getExtractDestination(options));
}

function copyBlueprintFiles(options) {
  var blueprintFolderRelativePath = "../../blueprints";
  var blueprintPath = path.resolve(__dirname, blueprintFolderRelativePath, options.blueprintName);

  var srcPath = path.join(blueprintPath, 'files');
  var destPath = getExtractDestination(options);

  return copy(srcPath, destPath);
}

function replaceInFile(file, placeholder, value) {
  return readFile(file, { encoding: 'utf-8' }).then(function(data) {
    var modifiedData = data.replace(placeholder, value);
    return writeFile(file, modifiedData);
  });
}

function replaceInFiles(options) {
  var basePath = getExtractDestination(options);
  return Promise.map(options.fileList, function(relativeFilePath) {
    var absoluteFilePath = path.join(basePath, relativeFilePath);
    return replaceInFile(absoluteFilePath, options.placeholder, options.addonName);
  });
}

function copyFileIfExists(oldFile, newFile) {
  return new Promise(function(resolve) {
    copy(oldFile, newFile, { clobber: true }).finally(resolve);
  });
}

function copyAddonFiles(options) {
  var destination = getExtractDestination(options);
  return Promise.map(options.fileMappings, function(fileMapping) {
    var sourceFile = fileMapping.appFile.replace(options.placeholder, options.addonName);
    var destinationFile = path.join(destination, fileMapping.addonFile);
    return copyFileIfExists(sourceFile, destinationFile);
  });
};

module.exports = function(options) {
  console.log('creating folder');
  return createAddonFolder(options).then(function() {
    console.log('copying blueprint');
    return copyBlueprintFiles(options);
  }).then(function() {
    console.log('replacing');
    return replaceInFiles(options);
  }).then(function () {
    console.log('copying addon files');
    return copyAddonFiles(options);
  });
};
