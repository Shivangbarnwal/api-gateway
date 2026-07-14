export async function logger(ctx, next) {
  console.log(`${ctx.req.method} ${ctx.req.url}`);
  await next();
}