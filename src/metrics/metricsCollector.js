export class MetricsCollector {
  constructor() {
    this.totalRequests = 0;
    this.statusCodes = {};
  }

  recordRequest() {
    this.totalRequests++;
  }

  getMetrics() {
    return {
      totalRequests: this.totalRequests,
      statusCodes: this.statusCodes,
    };
  }
  reset() {
    this.totalRequests = 0;
  }
  recordStatusCode(statusCode) {
  this.statusCodes[statusCode] =
    (this.statusCodes[statusCode] ?? 0) + 1;
  }
}