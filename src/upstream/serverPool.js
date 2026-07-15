import { UpstreamServer } from "./server.js";

export class ServerPool {
  constructor() {
    this.servers = [
      new UpstreamServer("localhost", 8001),
      new UpstreamServer("localhost", 8002),
      new UpstreamServer("localhost", 8003),
    ];
  }

  getServers() {
    return this.servers;
  }
}