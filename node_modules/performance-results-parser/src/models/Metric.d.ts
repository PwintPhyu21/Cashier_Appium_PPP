export type MetricType = 'COUNTER' | 'GAUGE' | 'RATE' | 'TREND';
export type Status = 'PASS' | 'FAIL';

declare class MetricFailure {
  field: string;
  difference: number;
}

declare class Metric {
  name: string;
  type: MetricType;
  status: Status;
  sum: number;
  rate: number;
  unit: string;
  avg: number;
  med: number;
  max: number;
  min: number;
  p90: number;
  p95: number;
  p99: number;
  failures: MetricFailure[];
}

declare namespace Metric {}

export = Metric;