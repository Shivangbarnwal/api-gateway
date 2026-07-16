import http from "node:http";

export class HealthChecker {
  constructor(serverPool, interval = 5000) {
    this.serverPool = serverPool;
    this.interval = interval;
  }

  start() {
    setInterval(() => {
      this.checkAll();
    }, this.interval);
  }

  checkAll() {
    const servers = this.serverPool.getServers();

    for (const server of servers) {
        const req = http.request(
        {
            hostname: server.host,
            port: server.port,
            path: "/health",
            method: "GET",
            timeout: 2000,
        },
        (res) => {
            if (res.statusCode === 200) {
            server.markHealthy();
            } else {
            server.markUnhealthy();
            }

            res.resume();
        }
        );

        req.on("timeout", () => {
        req.destroy();
        server.markUnhealthy();
        });

        req.on("error", () => {
        server.markUnhealthy();
        });

        req.end();
    }
    }
}