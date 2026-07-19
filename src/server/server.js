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

app.use(async (ctx, next) => {
  const response = await testProxy();

  console.log("Backend Response:");
  console.log(response);

  await next();
});

server.listen(PORT, () => {
  console.log(`Gateway listening on http://localhost:${PORT}`);
});
