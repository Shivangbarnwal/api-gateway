import http from "node:http";

export function createBackend(port, name) {
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
          service: name,
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
    console.log(`${name} listening on http://localhost:${port}`);
  });
}