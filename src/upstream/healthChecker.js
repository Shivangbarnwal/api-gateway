import http from "node:http";
import config from "../config/config.js";
  
export class HealthChecker {
  constructor(serverPool) {
    this.serverPool = serverPool;
    this.interval = config.health.interval;
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
            timeout: config.health.timeout,
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