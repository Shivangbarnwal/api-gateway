import { forwardRequest } from "../upstream/proxy.js";

export async function proxy(ctx) {
  await forwardRequest(ctx);
}