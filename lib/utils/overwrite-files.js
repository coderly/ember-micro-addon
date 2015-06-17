function copyFileIfExists(oldFile, newFile) {
  return new Promise(function(resolve) {
    copy(oldFile, newFile, { clobber: true }).finally(resolve);
  });
}

module.exports = function(fileMappings) {
  return Promise.map(fileMappings, function(fileMapping) {
    return copyFileIfExists(fileMapping.oldPath, fileMapping.newPath);
  });
}