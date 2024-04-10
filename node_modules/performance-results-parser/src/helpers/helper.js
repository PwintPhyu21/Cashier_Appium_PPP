const path = require('path');
const { totalist } = require('totalist/sync');
const globrex = require('globrex');
const Threshold = require('../models/Threshold');
const Metric = require('../models/Metric');
const Transaction = require('../models/Transaction');

/**
 * @param {string} file_path 
 */
function getMatchingFilePaths(file_path) {
  if (file_path.includes('*')) {
    const file_paths = [];
    const result = globrex(file_path);
    const dir_name = path.dirname(file_path.substring(0, file_path.indexOf('*') + 1));
    totalist(dir_name, (name) => {
      const current_file_path = `${dir_name}/${name}`;
      if (result.regex.test(current_file_path)) {
        file_paths.push(current_file_path);
      }
    });
    return file_paths;
  }
  return [file_path];
}

/**
 * @param {Transaction} transaction 
 * @param {Metric} metric 
 * @param {Threshold[]} thresholds 
 */
function setMetricStatus(transaction, metric, thresholds) {
  if (thresholds) {
    const threshold = thresholds.find(_threshold => {
      const metric_matched = _threshold.metric === metric.name;
      if (metric_matched) {
        if (_threshold.scope === 'TRANSACTION') {
          return _threshold.transactions.includes(transaction.name);
        } else if (_threshold.scope === 'OVERALL') {
          return transaction.name === 'TOTAL';
        }
        return true;
      }
      return false;
    });
    if (threshold) {
      for(let i = 0; i < threshold.checks.length; i++) {
        const check = threshold.checks[i];
        const [field, value] = check.split(/<|>/);
        const difference = metric[field] - parseFloat(value);
        if (check.includes('<')) {
          if (difference > 0) {
            metric.failures.push({
              field,
              difference
            });
          } 
        } else if (check.includes('>')) {
          if (difference < 0) {
            metric.failures.push({
              field,
              difference
            });
          }
        }
      }
    }
  }
  metric.status = metric.failures.length > 0 ? 'FAIL' : 'PASS';
}

module.exports = {
  getMatchingFilePaths,
  setMetricStatus
}