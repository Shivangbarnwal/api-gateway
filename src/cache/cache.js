import cache from "./index.js";
import { CacheEntry } from "./cacheEntry.js";
import metricsCollector from "../metrics/index.js";

export async function cacheMiddleware(ctx, next) {
    if (ctx.req.method !== "GET") {
        await next();
        return;
    }
    if (!ctx.service.cache.enabled) {
        await next();
        return;
    }


    if (
        ctx.req.headers.upgrade?.toLowerCase() ===
        "websocket"
    ) {
        await next();
        return;
    }

    const key = `${ctx.req.method}:${ctx.req.url}`;

    const entry = cache.get(key);

    if (!entry) {
        metricsCollector.recordCacheMiss();
        const chunks = [];

        const originalWrite =
            ctx.res.write.bind(ctx.res);
        const originalEnd =
            ctx.res.end.bind(ctx.res);
        ctx.res.write = function (
            chunk,
            encoding,
            callback
        ) {

            if (chunk) {
                chunks.push(Buffer.from(chunk));
            }

            return originalWrite(
                chunk,
                encoding,
                callback
            );
        };
        ctx.res.end = function (
            chunk,
            encoding,
            callback
        ) {

            if (chunk) {
                chunks.push(Buffer.from(chunk));
            }

            if (ctx.res.statusCode === 200) {
                console.log("CACHE STORE:", key);
                cache.set(
                    key,
                    new CacheEntry({
                        statusCode: ctx.res.statusCode,
                        headers: { ...ctx.res.getHeaders() },
                        body: Buffer.concat(chunks),
                        expiresAt:
                            Date.now() +
                            ctx.service.cache.ttl * 1000,
                    })
                );
                metricsCollector.recordCacheStore();
            }

            ctx.res.write = originalWrite;
            ctx.res.end = originalEnd;

            return originalEnd(
                chunk,
                encoding,
                callback
            );
        };
        await next();
        return;
    }
    console.log("CACHE HIT:", key);
    metricsCollector.recordCacheHit();
    ctx.res.statusCode =
        entry.statusCode;

    for (
        const [header, value]
        of Object.entries(entry.headers)
    ) {
        ctx.res.setHeader(header, value);
    }

    ctx.res.end(entry.body);
   
}