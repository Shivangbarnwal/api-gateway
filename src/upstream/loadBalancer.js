export class LoadBalancer {
  constructor(serverPool, strategy) {
    this.serverPool = serverPool;
    this.strategy = strategy;
  }

  next(serviceName, excludedServers = new Set()) {
    return this.strategy.next(
      this.serverPool.getServersForService(serviceName),
      excludedServers
    );
  }
}