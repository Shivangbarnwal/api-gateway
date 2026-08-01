import test from "node:test";
import assert from "node:assert/strict";

import { Router } from "../../src/router/router.js";

test("register() stores routes", () => {
    const router = new Router();

    router.register("/users", "users");

    assert.deepEqual(
        router.getSnapshot(),
        [
            {
                path: "/users",
                service: "users",
            },
        ]
    );
});

test("loadRoutes() loads every route", () => {
    const router = new Router();

    router.loadRoutes([
        {
            path: "/users",
            service: "users",
        },
        {
            path: "/products",
            service: "products",
        },
    ]);

    assert.equal(
        router.getSnapshot().length,
        2
    );
});

test("match() returns matching service", () => {
    const router = new Router();

    router.loadRoutes([
        {
            path: "/users",
            service: "users",
        },
    ]);

    assert.equal(
        router.match("/users"),
        "users"
    );
});

test("match() supports prefix matching", () => {
    const router = new Router();

    router.loadRoutes([
        {
            path: "/users",
            service: "users",
        },
    ]);

    assert.equal(
        router.match("/users/profile"),
        "users"
    );
});

test("match() returns null for unknown routes", () => {
    const router = new Router();

    router.loadRoutes([
        {
            path: "/users",
            service: "users",
        },
    ]);

    assert.equal(
        router.match("/payments"),
        null
    );
});

test("loadRoutes() replaces previous routes", () => {
    const router = new Router();

    router.loadRoutes([
        {
            path: "/users",
            service: "users",
        },
    ]);

    router.loadRoutes([
        {
            path: "/products",
            service: "products",
        },
    ]);

    assert.equal(
        router.match("/users"),
        null
    );

    assert.equal(
        router.match("/products"),
        "products"
    );
});