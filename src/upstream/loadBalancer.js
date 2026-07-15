export class LoadBalancer {
  constructor(serverPool) {
    this.serverPool = serverPool;
    this.currentIndex = 0;
  }

  next() {
    const servers = this.serverPool.getServers();

    return servers[0];
  }
}