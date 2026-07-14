export function handleRequest(req, res) {
  try {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    res.setHeader("Content-Type", "application/json");

    switch (req.url) {
      case "/":
        res.statusCode = 200;
        res.end(JSON.stringify({ message: "Gateway Home" }));
        break;

      case "/health":
        res.statusCode = 200;
        res.end(JSON.stringify({ status: "OK" }));
        break;

      default:
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Not Found" }));
    }
  } catch (err) {
    console.error(err);

    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}