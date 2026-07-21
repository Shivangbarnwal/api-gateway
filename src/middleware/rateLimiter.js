import { RateLimiter } from "../rateLimiter/rateLimiter.js";
import config from "../config/config.js";

const rateLimiter = new RateLimiter(
  config.rateLimit.limit,
  config.rateLimit.windowMs
);

export async function rateLimiterMiddleware(ctx,next) 
{
    const clientId = ctx.req.socket.remoteAddress;

    if (!rateLimiter.allow(clientId)) {
    ctx.res.statusCode = 429;
    ctx.res.setHeader("Content-Type", "application/json");

    ctx.res.end(
        JSON.stringify({
        error: "Too Many Requests",
        })
    );

    return;
    }

    await next();
}