export class UpstreamServer {
  constructor(service,host, port) {
    this.service = service;
    this.host = host;
    this.port = port;

    
    this.healthy = true;
    this.activeConnections = 0;
    // Used in future stages
    this.weight = 1;
    this.failureCount = 0;
  }
    isHealthy() {
    return this.healthy;
  }

  markHealthy() {
    this.healthy = true;
  }

  markUnhealthy() {
    this.healthy = false;
  }
  incrementConnections() {
    this.activeConnections++;
  }

  decrementConnections() {
    if (this.activeConnections > 0) {
        this.activeConnections--;
    }
  }

  getActiveConnections() {
    return this.activeConnections;
  }
  getSnapshot() {
    return {
      host: this.host,
      port: this.port,
      healthy: this.healthy,
      activeConnections: this.activeConnections,
    };
  }
}