import { UpstreamServer } from "./server.js";

export class ServerPool {
  constructor() {
    this.servers = [];
    this.services = new Map();

  }
  loadServices(configServices) {
    // Reset existing state (useful if we ever support config reloads)
    this.servers = [];
    this.services = new Map();

    for (const [serviceName, serviceConfig] of Object.entries(configServices)) {
      for (const instance of serviceConfig.instances) {
        this.addServer(
          new UpstreamServer(
            serviceName,
            instance.host,
            instance.port
          )
        );
      }
    }
  }
  addServer(server) {
    this.servers.push(server);

    if (!this.services.has(server.service)) {
        this.services.set(server.service, []);
    }

    this.services.get(server.service).push(server);
  }
  getServersForService(serviceName) {
    return this.services.get(serviceName) ?? [];
  }
  getServers() {
    return this.servers;
  }
  getSnapshot() {
    const snapshot = {};

    for (const [serviceName, servers] of this.services) {
      snapshot[serviceName] = servers.map(server =>
        server.getSnapshot()
      );
    }

    return snapshot;
  }
}