import http from "node:http";
import { LoadBalancer } from "./loadBalancer.js";
import { ServerPool } from "./serverPool.js";
import { RoundRobin } from "./algorithms/roundRobin.js";
import { HealthChecker } from "./healthChecker.js";
import { UPSTREAM_TIMEOUT } from "../config/constants.js";

const serverPool = new ServerPool();

const loadBalancer = new LoadBalancer(
    serverPool,
    new RoundRobin()
);
const healthChecker = new HealthChecker(serverPool);

healthChecker.start();

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function attemptRequest(ctx, server,body) {
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
        ctx.res.once("finish", resolve);
      }
    );
    proxyReq.setTimeout(UPSTREAM_TIMEOUT, () => {
      const err = new Error("Upstream timeout");
      err.code = "ETIMEDOUT";

      proxyReq.destroy(err);
    });

    proxyReq.on("error", (err) => {
      if (err.code === "ETIMEDOUT") {
        err.statusCode = 504;
        err.clientMessage = "Upstream request timed out";
      } else {
        server.markUnhealthy();
        err.statusCode = 502;
        err.clientMessage = "Unable to connect to upstream server";
      }

      reject(err);
    });
    if (body.length > 0) {
      proxyReq.write(body);
    }

    proxyReq.end();
  });
}

export async function forwardRequest(ctx) {
  const body = await readRequestBody(ctx.req);
  const attemptedServers = new Set();

  let server = loadBalancer.next(
    ctx.service.name,
    attemptedServers
  );

  if (!server) {
    ctx.res.statusCode = 503;

    ctx.res.setHeader("Content-Type", "application/json");

    ctx.res.end(
      JSON.stringify({
        error: "Service Unavailable",
        message: "No healthy upstream servers available",
      })
    );

    return;
  }
  let lastError = null;
  while (server) {
    

    try {
      await attemptRequest(ctx, server, body);
      return;
    } catch (err) {
      lastError = err;
      attemptedServers.add(server);
      server = loadBalancer.next(
        ctx.service.name,
        attemptedServers
      );
    }
  }
  ctx.res.statusCode = lastError?.statusCode ?? 503;

  ctx.res.setHeader("Content-Type", "application/json");

  ctx.res.end(
    JSON.stringify({
      error:
        lastError?.statusCode === 504
          ? "Gateway Timeout"
          : "Bad Gateway",
      message: lastError?.clientMessage ?? "All upstream servers failed",
    })
  );
}