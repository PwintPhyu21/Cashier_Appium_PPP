const jmeter = require('./jmeter');
const { getMatchingFilePaths } = require('../helpers/helper');

function getParser(result_type) {
  switch (result_type) {
    case 'jmeter':
      return jmeter;
    default:
      throw `UnSupported Result Type - ${result_type}`;
  }
}

function merge(results) {
  return results[0];
}

/**
 * @param {import('../index').ParseOptions} options 
 */
function parse(options) {
  const parser = getParser(options.type);
  const results = [];
  for (let i = 0; i < options.files.length; i++) {
    const matched_files = getMatchingFilePaths(options.files[i]);
    for (let j = 0; j < matched_files.length; j++) {
      const file = matched_files[j];
      results.push(parser.parse(file, options.thresholds));
    }
  }
  return merge(results);
}

module.exports = {
  parse
}