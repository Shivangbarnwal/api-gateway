import router from "../router/routes.js";
import registry from "../services/index.js";
import metricsCollector from "../metrics/index.js";

export async function routerMiddleware(ctx, next) {
  if (ctx.req.url === "/metrics") {
    ctx.res.statusCode = 200;
    ctx.res.setHeader("Content-Type", "application/json");

    ctx.res.end(
      JSON.stringify(metricsCollector.getMetrics())
    );
    
    return;
  }
  const serviceName = router.match(ctx.req.url);

  if (!serviceName) {
    ctx.res.statusCode = 404;
    ctx.res.setHeader("Content-Type", "application/json");

    ctx.res.end(
      JSON.stringify({
        error: "Route Not Found",
      })
    );

    return;
  }

  ctx.route = serviceName;
  ctx.service = registry.get(serviceName);
  metricsCollector.recordService(serviceName);
  await next();
}