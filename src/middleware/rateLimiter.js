import { RateLimiter } from "../rateLimiter/rateLimiter.js";

const rateLimiter = new RateLimiter(
  5,
  10_000
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