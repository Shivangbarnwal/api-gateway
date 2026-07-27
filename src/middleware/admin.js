import { handleAdmin } from "../admin/controller.js";

export async function admin(ctx, next) {
  // Not an admin endpoint
  if (!ctx.req.url.startsWith("/admin")) {
    await next();
    return;
  }

  // Should never happen because auth middleware runs first,
  // but keeping this makes the middleware self-contained.
  if (!ctx.user) {
    ctx.res.statusCode = 401;
    ctx.res.setHeader("Content-Type", "application/json");

    ctx.res.end(
      JSON.stringify({
        error: "Unauthorized",
        message: "Authentication required",
      })
    );

    return;
  }

  // Authorization
  if (ctx.user.role !== "admin") {
    ctx.res.statusCode = 403;
    ctx.res.setHeader("Content-Type", "application/json");

    ctx.res.end(
      JSON.stringify({
        error: "Forbidden",
        message: "Administrator access required",
      })
    );

    return;
  }

  // Authenticated admin
  handleAdmin(ctx.req, ctx.res);
}