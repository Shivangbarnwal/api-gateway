import test from "node:test";
import assert from "node:assert/strict";

import { request } from "../helpers/request.js";

test("admin can access config", async () => {
    const response = await request({
        path: "/admin/config",
        token: "admin-token",
    });

    assert.equal(response.status, 200);
});

test("normal user cannot access config", async () => {
    const response = await request({
        path: "/admin/config",
        token: "user-token",
    });

    assert.equal(response.status, 403);
});

test("unauthenticated user cannot access config", async () => {
    const response = await request({
        path: "/admin/config",
        token: "",
    });

    assert.equal(response.status, 401);
});

test("admin can access routes", async () => {
    const response = await request({
        path: "/admin/routes",
        token: "admin-token",
    });

    assert.equal(response.status, 200);
});

test("admin can access services", async () => {
    const response = await request({
        path: "/admin/services",
        token: "admin-token",
    });

    assert.equal(response.status, 200);
});

test("admin can access cache", async () => {
    const response = await request({
        path: "/admin/cache",
        token: "admin-token",
    });

    assert.equal(response.status, 200);
});