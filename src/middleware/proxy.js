import { forwardRequest } from "../proxy/proxy.js";

export async function proxy(ctx) {
  await forwardRequest(ctx);
}