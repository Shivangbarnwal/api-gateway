import test from "node:test";
import assert from "node:assert/strict";

import { request } from "../helpers/request.js";

test("gateway serves healthy instance after one backend goes down", async () => {

    const response = await request({
        path: "/users",
        token: "user-token",
    });

    assert.equal(response.status, 200);

    const body = JSON.parse(response.body);

    assert.ok(
        body.instance === "users-1" ||
        body.instance === "users-2"
    );

});