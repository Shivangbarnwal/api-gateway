import test from "node:test";
import assert from "node:assert/strict";

import { request } from "../helpers/request.js";

test("metrics endpoint returns gateway metrics", async () => {

    // Generate some traffic first
    await request({
        path: "/users",
        token: "user-token",
    });

    const response = await request({
        path: "/metrics",
        token: "admin-token",
    });

    assert.equal(response.status, 200);

    const metrics = JSON.parse(response.body);

    assert.ok(typeof metrics.totalRequests === "number");
    assert.ok(typeof metrics.averageLatencyMs === "number");

    assert.ok(metrics.statusCodes);
    assert.ok(metrics.serviceRequests);
    assert.ok(metrics.cache);

    assert.ok(typeof metrics.cache.hits === "number");
    assert.ok(typeof metrics.cache.misses === "number");
    assert.ok(typeof metrics.cache.stores === "number");
});
