import { Context } from "./context.js";
import metricsCollector from "../metrics/index.js";

export class Application {
  constructor() {
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

    compose(ctx) {
        let index = -1;

        const dispatch = async (i) => {
            if (i <= index) {
            throw new Error("next() called multiple times");
            }

            index = i;

            if (i === this.middlewares.length) return;

            const middleware = this.middlewares[i];

            await middleware(ctx, () => dispatch(i + 1));
        };

        return dispatch(0);
    }
    async handle(req, res) {
        metricsCollector.recordRequest();
        const startTime = performance.now();
        const ctx = new Context(req, res);
        ctx.res.once("finish", () => {
            metricsCollector.recordStatusCode(ctx.res.statusCode);
            const duration =
                performance.now() - startTime;

            metricsCollector.recordLatency(duration);
        });
        try {
            await this.compose(ctx);

            if (!ctx.res.writableEnded) {
            ctx.res.statusCode = 200;
            ctx.res.setHeader("Content-Type", "application/json");

            ctx.res.end(
                JSON.stringify({
                message: "Application is handling requests",
                })
            );
            }
        } catch (err) {
            console.error(err);

            if (!ctx.res.writableEnded) {
            ctx.res.statusCode = err.statusCode || 500;
            ctx.res.setHeader("Content-Type", "application/json");

            ctx.res.end(
                JSON.stringify({
                error:
                    err.statusCode === 502
                        ? "Bad Gateway"
                        : "Internal Server Error",
                })
            );
            }
        }
        }
}