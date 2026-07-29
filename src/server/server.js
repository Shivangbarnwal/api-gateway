import http from "node:http";
import { Application } from "../core/application.js";
import { proxy } from "../middleware/proxy.js";
import { logger } from "../middleware/logger.js";
import { routerMiddleware } from "../middleware/router.js";
import { rateLimiterMiddleware } from "../middleware/rateLimiter.js";
import { auth } from "../middleware/auth.js";
import config from "../config/config.js";
import { admin } from "../middleware/admin.js";
import { cacheMiddleware } from "../cache/cache.js";

const PORT = config.server.port;
const app = new Application();

app.use(logger);
app.use(rateLimiterMiddleware);
app.use(auth);
app.use(admin);
app.use(routerMiddleware);
app.use(cacheMiddleware);
app.use(proxy);

const server = http.createServer(async (req, res) => {
  await app.handle(req, res);
});


server.listen(PORT, () => {
  console.log(`Gateway listening on http://localhost:${PORT}`);
});
