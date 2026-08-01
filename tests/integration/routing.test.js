import test from "node:test";
import assert from "node:assert/strict";

import { request } from "../helpers/request.js";

test("users route reaches users backend", async () => {

    const response = await request({
        path: "/users",
    });

    assert.equal(response.status, 200);

    const body = JSON.parse(response.body);

    assert.equal(body.service, "users");
    assert.equal(body.method, "GET");
    assert.equal(body.path, "/users");

});

test("products route reaches products backend", async () => {

    const response = await request({
        path: "/products",
    });

    assert.equal(response.status, 200);

    const body = JSON.parse(response.body);

    assert.equal(body.service, "products");

});

test("payments route reaches payments backend", async () => {

    const response = await request({
        path: "/payments",
    });

    assert.equal(response.status, 200);

    const body = JSON.parse(response.body);

    assert.equal(body.service, "payments");

});

test("unknown route returns 404", async () => {

    const response = await request({
        path: "/unknown",
    });

    assert.equal(response.status, 404);

});