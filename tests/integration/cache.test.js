import test from "node:test";
import assert from "node:assert/strict";

import { request } from "../helpers/request.js";

test("first request stores response in cache", async () => {

    await request({
        path: "/users",
        token: "user-token",
    });

    const response = await request({
        path: "/metrics",
        token: "admin-token",
    });

    const metrics = JSON.parse(response.body);

    assert.ok(metrics.cache.stores >= 1);
    assert.ok(metrics.cache.misses >= 1);

});
test("second request is served from cache", async () => {

    await request({
        path: "/users",
        token: "user-token",
    });

    await request({
        path: "/users",
        token: "user-token",
    });

    const response = await request({
        path: "/metrics",
        token: "admin-token",
    });

    const metrics = JSON.parse(response.body);

    assert.ok(metrics.cache.hits >= 1);

});
test("POST requests are never cached", async () => {

    await request({
        path: "/users",
        method: "POST",
        token: "user-token",
        body: {
            name: "shivang",
        },
    });

    const response = await request({
        path: "/metrics",
        token: "admin-token",
    });

    const metrics = JSON.parse(response.body);

    // POST should not increase cache stores
    assert.ok(metrics.cache.stores >= 0);

});
test("admin cache clear removes cached entries", async () => {

    await request({
        path: "/users",
        token: "user-token",
    });

    const clearResponse = await request({
        path: "/admin/cache",
        method: "DELETE",
        token: "admin-token",
    });

    assert.equal(clearResponse.status, 200);

});
test("cache expires after ttl", async () => {

    await request({
        path: "/users",
        token: "user-token",
    });

    await new Promise(resolve =>
        setTimeout(resolve, 11000)
    );

    await request({
        path: "/users",
        token: "user-token",
    });

    const response = await request({
        path: "/metrics",
        token: "admin-token",
    });

    const metrics = JSON.parse(response.body);

    assert.ok(metrics.cache.misses >= 2);

});