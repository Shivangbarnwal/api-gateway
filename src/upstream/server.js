export class UpstreamServer {
  constructor(host, port) {
    this.host = host;
    this.port = port;

    // Used in future stages
    this.healthy = true;
    this.activeConnections = 0;
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

}