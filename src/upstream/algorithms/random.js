export class RandomStrategy {
  next(servers, excludedServers = new Set()) {
    const healthyServers = servers.filter(
      server =>
        server.isHealthy() &&
        !excludedServers.has(server)
    );

    if (healthyServers.length === 0) {
      return null;
    }

    const index = Math.floor(
      Math.random() * healthyServers.length
    );

    return healthyServers[index];
  }
}