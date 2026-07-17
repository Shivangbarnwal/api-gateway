export class RoundRobin {
  constructor() {
    this.currentIndex = 0;
  }

  next(servers, excludedServers = new Set()) {
    const totalServers = servers.length;

    for (let i = 0; i < totalServers; i++) {
      const server = servers[this.currentIndex];

      this.currentIndex =
        (this.currentIndex + 1) % totalServers;

      if (
          server.isHealthy() &&
          !excludedServers.has(server)
      ){
        return server;
      }
    }

    return null;
  }
}