import http from "node:http";

import { ServerPool } from "./serverPool.js";

const serverPool = new ServerPool();

export function forwardRequest(ctx) {

  const server = serverPool.getServers()[0];

  return new Promise((resolve, reject) => {
    const proxyReq = http.request(
      {
        hostname: server.host,
        port: server.port,
        path: ctx.req.url,
        method: ctx.req.method,
        headers: ctx.req.headers,
      },
      (proxyRes) => {
        // Copy status code
        ctx.res.statusCode = proxyRes.statusCode;

        // Copy all response headers
        Object.entries(proxyRes.headers).forEach(([key, value]) => {
          if (value !== undefined) {
            ctx.res.setHeader(key, value);
          }
        });

        // Pipe backend response directly to client
        proxyRes.pipe(ctx.res);

        proxyRes.on("end", resolve);
      }
    );

    proxyReq.on("error", (err) => {
        err.statusCode = 502;
        reject(err);
    });
    ctx.req.pipe(proxyReq);
  });
}