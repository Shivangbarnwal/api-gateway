import { getRoutes } from "./handlers/routes.js";
import { getServices } from "./handlers/services.js";
import { getConfig } from "./handlers/config.js";

const handlers = {
  "/admin/routes": getRoutes,
  "/admin/services": getServices,
  "/admin/config": getConfig,
};

export function handleAdmin(req, res) {
  const handler = handlers[req.url];

  if (!handler) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");

    res.end(
      JSON.stringify({
        error: "Not Found",
        message: "Unknown admin endpoint",
      })
    );

    return true;
  }

  handler(req, res);
  return true;
}