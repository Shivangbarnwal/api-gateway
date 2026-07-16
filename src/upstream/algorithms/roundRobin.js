export class RoundRobin {
  constructor() {
    this.currentIndex = 0;
  }

  next(servers) {
    const totalServers = servers.length;

    for (let i = 0; i < totalServers; i++) {
      const server = servers[this.currentIndex];

      this.currentIndex =
        (this.currentIndex + 1) % totalServers;

      if (server.isHealthy()) {
        return server;
      }
    }

    return null;
  }
}