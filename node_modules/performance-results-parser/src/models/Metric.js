class Metric {

  constructor() {
    this.name = '';
    this.type = '';
    this.sum = 0;
    this.rate = 0;
    this.unit = '';
    this.avg = 0;
    this.med = 0;
    this.max = 0;
    this.min = 0;
    this.p90 = 0;
    this.p95 = 0;
    this.p99 = 0;
    this.failures = [];
  }

}

module.exports = Metric;