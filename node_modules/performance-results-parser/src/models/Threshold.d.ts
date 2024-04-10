export type ThresholdScope = 'OVERALL' | 'TRANSACTION';

declare class Threshold {
  metric: string;
  scope: ThresholdScope;
  transactions: string[];
  checks: string[];
}

declare namespace Threshold {}

export = Threshold;