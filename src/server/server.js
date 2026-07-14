import http from "node:http";
import { Application } from "../core/application.js";
import { logger } from "../middleware/logger.js";

const PORT = 8080;
const app = new Application();

app.use(logger);
const server = http.createServer(async (req, res) => {
  await app.handle(req, res);
});

server.listen(PORT, () => {
  console.log(`Gateway listening on http://localhost:${PORT}`);
});
