import { serverPool } from "../../upstream/proxy.js";
import config from "../../config/config.js";


export function getServices(req, res) {
  const runtime = serverPool.getSnapshot();

  const response = {};

  for (const [serviceName, instances] of Object.entries(runtime)) {
    response[serviceName] = {
      strategy: config.services[serviceName].strategy,
      instances,
    };
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(response, null, 2));
}