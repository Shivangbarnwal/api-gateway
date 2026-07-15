export class LoadBalancer {
  constructor(serverPool, strategy) {
    this.serverPool = serverPool;
    this.strategy = strategy;
  }

  next() {
    return this.strategy.next(
      this.serverPool.getServers()
    );
  }
}