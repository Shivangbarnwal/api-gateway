import { Authenticator } from "../auth/authenticator.js";

const authenticator = new Authenticator();

export async function auth(ctx, next) {
    const authHeader = ctx.req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;
    const result = authenticator.authenticate(token);
    if (!result.authenticated) {
        ctx.res.statusCode = 401;

        ctx.res.setHeader(
            "Content-Type",
            "application/json"
        );

        ctx.res.end(
            JSON.stringify({
            error: "Unauthorized",
            })
        );

        return;
    }
    ctx.user = result.user;
    await next();
}