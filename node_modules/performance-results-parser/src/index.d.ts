import PerformanceTestResult from "./models/PerformanceTestResult";
import Threshold from "./models/Threshold";

declare interface PerformanceParseOptions {
  type: string;
  files: string[];
  thresholds: Threshold[];
}

export function parse(options: PerformanceParseOptions): PerformanceTestResult;

export namespace parser { }