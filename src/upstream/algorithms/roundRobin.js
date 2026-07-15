export class RoundRobin {
  constructor() {
    this.currentIndex = 0;
  }

  next(servers) {
    const server = servers[this.currentIndex];

    this.currentIndex =
      (this.currentIndex + 1) % servers.length;

    return server;
  }
}