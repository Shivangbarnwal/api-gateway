export class MetricsCollector {
  constructor() {
    this.totalRequests = 0;
    this.statusCodes = {};
    this.totalLatency = 0;
    this.requestCount = 0;
    this.serviceRequests = {};

    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.cacheStores = 0;
  }

  recordRequest() {
    this.totalRequests++;
  }

  getMetrics() {
    return {
      totalRequests: this.totalRequests,
      statusCodes: this.statusCodes,
      averageLatencyMs:
        this.requestCount === 0
            ? 0
            : this.totalLatency / this.requestCount,
      serviceRequests: this.serviceRequests,
      cache: {
        hits: this.cacheHits,
        misses: this.cacheMisses,
        stores: this.cacheStores,
    },
    };
  }
  reset() {
    this.totalRequests = 0;
    this.statusCodes = {};
    this.totalLatency = 0;
    this.requestCount = 0;
    this.serviceRequests = {};
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.cacheStores = 0;
  }
  recordStatusCode(statusCode) {
  this.statusCodes[statusCode] =
    (this.statusCodes[statusCode] ?? 0) + 1;
  }
  recordLatency(durationMs) {
    this.totalLatency += durationMs;
    this.requestCount++;
  }
  recordService(serviceName) {
  this.serviceRequests[serviceName] =
    (this.serviceRequests[serviceName] ?? 0) + 1;
  }
  recordCacheHit() {
    this.cacheHits++;
  }

  recordCacheMiss() {
    this.cacheMisses++;
  }

  recordCacheStore() {
    this.cacheStores++;
  }
}