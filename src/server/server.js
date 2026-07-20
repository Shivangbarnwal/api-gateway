import http from "node:http";
import { Application } from "../core/application.js";
import { proxy } from "../middleware/proxy.js";
import { logger } from "../middleware/logger.js";
import { routerMiddleware } from "../middleware/router.js";


const PORT = 8080;
const app = new Application();

app.use(logger);
app.use(routerMiddleware);
app.use(proxy);

const server = http.createServer(async (req, res) => {
  await app.handle(req, res);
});


server.listen(PORT, () => {
  console.log(`Gateway listening on http://localhost:${PORT}`);
});
