export class LoadBalancer {
  constructor(serverPool, strategy) {
    this.serverPool = serverPool;
    this.strategy = strategy;
  }

  next(excludedServers = new Set()) {
    return this.strategy.next(
      this.serverPool.getServers(),
      excludedServers
    );
  }
}