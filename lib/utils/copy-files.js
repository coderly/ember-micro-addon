var fs = require('fs-extra');
var Promise = require('../ext/promise');
var copy = Promise.denodeify(fs.copy);


function copyFileIfExists(oldFile, newFile) {
  return new Promise(function(resolve) {
    copy(oldFile, newFile, { clobber: true }).finally(resolve);
  });
}

module.exports = function(fileMappings) {
  return Promise.map(fileMappings, function(fileMapping) {
    return copyFileIfExists(fileMapping.src, fileMapping.dest);
  });
};
