import router from "../router/routes.js";
import registry from "../services/index.js";

export async function routerMiddleware(ctx, next) {
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

  await next();
}