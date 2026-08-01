import http from "node:http";

export function createBackend(port, serviceName, instanceId) {
  const server = http.createServer((req, res) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      
      res.writeHead(200, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          service: serviceName,
          instance: `${serviceName}-${instanceId}`,
          method: req.method,
          path: req.url,
          headers: req.headers,
          body,
          timestamp: new Date().toISOString(),
        })
      );
    });
  });

  server.listen(port, () => {
    console.log(`${serviceName}-${instanceId} container started (port ${port})`);
  });
}