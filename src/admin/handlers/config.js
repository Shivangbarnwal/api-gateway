import config from "../../config/config.js";

export function getConfig(req, res) {
  const response = {
    server: config.server,
    proxy: config.proxy,
    health: config.health,
    rateLimit: config.rateLimit,
  };

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(response, null, 2));
}