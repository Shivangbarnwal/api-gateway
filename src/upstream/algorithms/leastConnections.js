export class LeastConnections {
  next(servers, excludedServers = new Set()) {
    let selected = null;

    for (const server of servers) {
      if (
        !server.isHealthy() ||
        excludedServers.has(server)
      ) {
        continue;
      }

      if (
        selected === null ||
        server.getActiveConnections() <
          selected.getActiveConnections()
      ) {
        selected = server;
      }
    }

    return selected;
  }
}