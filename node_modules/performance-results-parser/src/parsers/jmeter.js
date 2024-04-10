const fs = require('fs');
const path = require('path');
const csv_json = require('csvjson');
const { aggregate } = require('parse-jtl');
const PerformanceTestResult = require('../models/PerformanceTestResult');
const Transaction = require('../models/Transaction');
const Metric = require('../models/Metric');
const Threshold = require('../models/Threshold');
const { setMetricStatus } = require('../helpers/helper');

function parse(file, thresholds) {
  const extension = path.extname(file);
  if (extension === '.csv') {
    return getResultFromCSV(file, thresholds);
  } else {
    return getResultFromJTLFile(file, thresholds);
  }
}

function getResultFromCSV(file, thresholds) {
  const cwd = process.cwd();
  const results = csv_json.toObject(fs.readFileSync(path.join(cwd, file), { encoding: 'utf8' }));
  const perf_result = getTransaction(new PerformanceTestResult(), results[results.length - 1], thresholds);
  for (let i = 0; i < results.length - 1; i++) {
    perf_result.transactions.push(getTransaction(new Transaction(), results[i], thresholds));
  }
  if (perf_result.status === 'PASS' && perf_result.transactions.some(_trans => _trans.status === 'FAIL')) {
    perf_result.status = 'FAIL';
  }
  return perf_result;
}

/**
 * @param {Transaction} transaction 
 * @param {object} record 
 * @param {Threshold[]} thresholds
 * @returns 
 */
function getTransaction(transaction, record, thresholds) {
  transaction.name = record['Label'];
  transaction.metrics.push(getSampleMetric(transaction, record, thresholds));
  transaction.metrics.push(getRequestDurationMetric(transaction, record, thresholds));
  transaction.metrics.push(getErrorMetric(transaction, record, thresholds));
  transaction.metrics.push(getDataSentMetric(transaction, record, thresholds));
  transaction.metrics.push(getDataReceivedMetric(transaction, record, thresholds));
  if (record['Average Latency']) {
    transaction.metrics.push(getRequestLatencyMetric(transaction, record, thresholds));
  }
  transaction.status = transaction.metrics.some(_metric => _metric.status === 'FAIL') ? 'FAIL' : 'PASS';
  return transaction;
}

/**
 * @param {object} record 
 * @param {Threshold[]} thresholds 
 * @returns 
 */
function getSampleMetric(transaction, record, thresholds) {
  const metric = new Metric();
  metric.name = 'Samples';
  metric.type = 'COUNTER';
  metric.sum = parseInt(record['# Samples']);
  metric.rate = parseFloat(record['Throughput']);
  metric.unit = '/s';
  setMetricStatus(transaction, metric, thresholds);
  return metric;
}

/**
 * @param {object} record 
 * @param {Threshold[]} thresholds 
 * @returns 
 */
function getRequestDurationMetric(transaction, record, thresholds) {
  const metric = new Metric();
  metric.name = 'Duration';
  metric.type = 'TREND';
  metric.avg = parseInt(record['Average']);
  metric.med = parseInt(record['Median']);
  metric.p90 = parseInt(record['90% Line']);
  metric.p95 = parseInt(record['95% Line']);
  metric.p99 = parseInt(record['99% Line']);
  metric.min = parseInt(record['Min']);
  metric.max = parseInt(record['Max']);
  setMetricStatus(transaction, metric, thresholds);
  return metric;
}

/**
 * @param {object} record 
 * @param {Threshold[]} thresholds 
 * @returns 
 */
function getRequestLatencyMetric(transaction, record, thresholds) {
  const metric = new Metric();
  metric.name = 'Latency';
  metric.type = 'TREND';
  metric.avg = parseInt(record['Average Latency']);
  metric.med = parseInt(record['Median Latency']);
  metric.p90 = parseInt(record['90% Latency']);
  metric.p95 = parseInt(record['95% Latency']);
  metric.p99 = parseInt(record['99% Latency']);
  metric.min = parseInt(record['Min Latency']);
  metric.max = parseInt(record['Max Latency']);
  setMetricStatus(transaction, metric, thresholds);
  return metric;
}

/**
 * @param {object} record 
 * @param {Threshold[]} thresholds 
 * @returns 
 */
function getErrorMetric(transaction, record, thresholds) {
  const metric = new Metric();
  metric.name = 'Errors';
  metric.type = 'RATE';
  metric.rate = parseFloat(record['Error %'].replace('%', ''));
  metric.unit = '%';
  setMetricStatus(transaction, metric, thresholds);
  return metric;
}

/**
 * @param {object} record 
 * @param {Threshold[]} thresholds 
 * @returns 
 */
function getDataSentMetric(transaction, record, thresholds) {
  const metric = new Metric();
  metric.name = 'Data Sent';
  metric.type = 'COUNTER';
  metric.rate = parseFloat(record['Sent KB/sec']);
  metric.unit = 'KB/sec';
  const samples = parseInt(record['# Samples']);
  const throughput = parseFloat(record['Throughput']);
  metric.sum = parseInt(metric.rate * ( samples * 1000 / throughput));
  setMetricStatus(transaction, metric, thresholds);
  return metric;
}

/**
 * @param {object} record 
 * @param {Threshold[]} thresholds 
 * @returns 
 */
function getDataReceivedMetric(transaction, record, thresholds) {
  const metric = new Metric();
  metric.name = 'Data Received';
  metric.type = 'COUNTER';
  metric.rate = parseFloat(record['Received KB/sec']);
  metric.unit = 'KB/sec';
  const samples = parseInt(record['# Samples']);
  const throughput = parseFloat(record['Throughput']);
  metric.sum = parseInt(metric.rate * ( samples * 1000 / throughput));
  setMetricStatus(transaction, metric, thresholds);
  return metric;
}

function getResultFromJTLFile(file, thresholds) {
  const results = aggregate(file);
  const perf_result = getTransaction(new PerformanceTestResult(), results[results.length - 1], thresholds);
  for (let i = 0; i < results.length - 1; i++) {
    perf_result.transactions.push(getTransaction(new Transaction(), results[i], thresholds));
  }
  if (perf_result.status === 'PASS' && perf_result.transactions.some(_trans => _trans.status === 'FAIL')) {
    perf_result.status = 'FAIL';
  }
  return perf_result;
}

module.exports = {
  parse
}