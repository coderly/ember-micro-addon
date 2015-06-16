var STRING_DASHERIZE_REGEXP = (/[ _]/g);
var STRING_DECAMELIZE_REGEXP = (/([a-z\d])([A-Z])/g);

function decamelize (str) {
  return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
}

function dasherize(str) {
  return decamelize(str).replace(STRING_DASHERIZE_REGEXP,'-');
}

module.exports = {
  dasherize: dasherize
};
