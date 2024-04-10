import * as Transaction from './Transaction';
import * as Metric from './Metric';

export type Status = 'PASS' | 'FAIL';

declare class PerformanceTestResult {
  name: string;
  status: Status;
  metrics: Metric[];
  transactions: Transaction[];
}

declare namespace PerformanceTestResult {}

export = PerformanceTestResult;