import http from "node:http";

const PORT = 8001;

const server = http.createServer((req, res) => {
  console.log(`[Backend] ${req.method} ${req.url}`);

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(
    JSON.stringify({
      service: "Backend Service",
      method: req.method,
      path: req.url,
      timestamp: new Date().toISOString(),
    })
  );
});

server.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});