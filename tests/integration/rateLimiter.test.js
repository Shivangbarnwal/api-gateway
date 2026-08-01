import test from "node:test";
import assert from "node:assert/strict";

import { request } from "../helpers/request.js";

test("rate limiter blocks excessive requests", async () => {

    let response;

    for (let i = 0; i < 100; i++) {

        response = await request({
            path: "/users",
            token: "user-token",
        });

        if (response.status === 429) {
            break;
        }
    }

    assert.equal(response.status, 429);

});
test("requests are allowed again after rate limit window", async () => {

    await new Promise(resolve =>
        setTimeout(resolve, 11000)
    );

    const response = await request({
        path: "/users",
        token: "user-token",
    });

    assert.equal(response.status, 200);

});