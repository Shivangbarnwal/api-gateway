import { getRoutes } from "./handlers/routes.js";
import { getServices } from "./handlers/services.js";
import { getConfig } from "./handlers/config.js";
import {
  getCache,
  clearCache
} from "./handlers/cache.js";


const handlers = {

  "/admin/routes": {
    GET: getRoutes,
  },

  "/admin/services": {
    GET: getServices,
  },

  "/admin/config": {
    GET: getConfig,
  },

  "/admin/cache": {
    GET: getCache,
    DELETE: clearCache,
  },

};


export function handleAdmin(req, res) {

  const route = handlers[req.url];


  if (!route) {

    res.statusCode = 404;

    res.setHeader(
      "Content-Type",
      "application/json"
    );

    res.end(
      JSON.stringify({
        error: "Not Found",
        message: "Unknown admin endpoint",
      })
    );

    return true;
  }


  const handler = route[req.method];


  if (!handler) {

    res.statusCode = 405;

    res.setHeader(
      "Content-Type",
      "application/json"
    );

    res.end(
      JSON.stringify({
        error: "Method Not Allowed",
      })
    );

    return true;
  }


  handler(req, res);

  return true;
}