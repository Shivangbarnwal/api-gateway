import { UpstreamServer } from "./server.js";

export class ServerPool {
  constructor() {
    this.servers = [];
    this.services = new Map();

    this.addServer(
        new UpstreamServer("users", "localhost", 8001)
    );

    this.addServer(
        new UpstreamServer("users", "localhost", 8002)
    );

    this.addServer(
        new UpstreamServer("products", "localhost", 8003)
    );
  }
  addServer(server) {
    this.servers.push(server);

    if (!this.services.has(server.service)) {
        this.services.set(server.service, []);
    }

    this.services
        .get(server.service)
        .push(server);
  }
  getServersForService(serviceName) {
    return this.services.get(serviceName) ?? [];
  }
  getServers() {
    return this.servers;
  }
}