import http from "node:http";

const PORT = 8001;

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
        service: "Backend Service",
        method: req.method,
        path: req.url,
        headers: req.headers,
        body,
        timestamp: new Date().toISOString(),
      })
    );
  });
});

server.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});