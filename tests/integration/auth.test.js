import test from "node:test";
import assert from "node:assert/strict";

import { request } from "../helpers/request.js";

test("valid user token is accepted", async () => {
    const response = await request({
        path: "/users",
        token: "user-token",
    });

    assert.equal(response.status, 200);
});

test("valid admin token is accepted", async () => {
    const response = await request({
        path: "/users",
        token: "admin-token",
    });

    assert.equal(response.status, 200);
});

test("invalid token returns 401", async () => {
    const response = await request({
        path: "/users",
        token: "invalid-token",
    });

    assert.equal(response.status, 401);
});

test("missing token returns 401", async () => {
    const response = await request({
        path: "/users",
        token: "",
    });

    assert.equal(response.status, 401);
});