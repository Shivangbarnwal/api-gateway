export async function logger(ctx, next) {
  const start = performance.now();

  await next();

  const duration = performance.now() - start;

  const timestamp = new Date().toISOString();

  let level = "INFO";

  if (ctx.res.statusCode >= 500) {
    level = "ERROR";
  } else if (ctx.res.statusCode >= 400) {
    level = "WARN";
  }
  const upstream = ctx.upstream
  ? `${ctx.upstream.host}:${ctx.upstream.port}`
  : "-";
  console.log(
    `[${timestamp}] ${level} [${ctx.requestId}] ${ctx.req.method} ${ctx.req.url} -> ${upstream} ${ctx.res.statusCode} ${duration.toFixed(2)}ms`
  );
}