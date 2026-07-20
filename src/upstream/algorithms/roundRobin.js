export class RoundRobin {
  constructor() {
    this.currentIndex = 0;
  }

  next(servers, excludedServers = new Set()) {
    const totalServers = servers.length;

    if (totalServers === 0) {
      return null;
    }

    for (let i = 0; i < totalServers; i++) {
      const index = this.currentIndex % totalServers;
      const server = servers[index];

      this.currentIndex = index + 1;

      if (
        server.isHealthy() &&
        !excludedServers.has(server)
      ) {
        return server;
      }
    }

    return null;
  }
}