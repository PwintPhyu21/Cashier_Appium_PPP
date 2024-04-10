import * as Metric from './Metric';

export type Status = 'PASS' | 'FAIL';

declare class Transaction {
  name: string;
  status: Status;
  metrics: Metric[];
}

declare namespace Transaction {}

export = Transaction;