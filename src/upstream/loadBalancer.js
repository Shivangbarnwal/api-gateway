export class LoadBalancer {
  constructor(serverPool) {
    this.serverPool = serverPool;
    this.currentIndex = 0;
  }

  next() {
    const servers = this.serverPool.getServers();

    const server = servers[this.currentIndex];

    this.currentIndex =
        (this.currentIndex + 1) % servers.length;

    return server;
  }
}