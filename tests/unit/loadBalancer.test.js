import test from "node:test";
import assert from "node:assert/strict";

import { LoadBalancer } from "../../src/upstream/loadBalancer.js";
import { ServerPool } from "../../src/upstream/serverPool.js";

function createPool() {
    const pool = new ServerPool();

    pool.loadServices({
        users: {
            instances: [
                {
                    host: "host1",
                    port: 8001,
                },
                {
                    host: "host2",
                    port: 8002,
                },
            ],
        },
        products: {
            instances: [
                {
                    host: "host3",
                    port: 8003,
                },
            ],
        },
    });

    return pool;
}

test("loadStrategies() creates strategies for every service", () => {
    const pool = createPool();

    const lb = new LoadBalancer(pool);

    lb.loadStrategies({
        users: {
            strategy: "roundRobin",
        },
        products: {
            strategy: "random",
        },
    });

    assert.ok(
        lb.strategies.has("users")
    );

    assert.ok(
        lb.strategies.has("products")
    );
});

test("next() returns a server for configured service", () => {
    const pool = createPool();

    const lb = new LoadBalancer(pool);

    lb.loadStrategies({
        users: {
            strategy: "roundRobin",
        },
    });

    const server = lb.next("users");

    assert.equal(server.service, "users");
});

test("next() throws for unknown strategy configuration", () => {
    const pool = createPool();

    const lb = new LoadBalancer(pool);

    assert.throws(
        () => lb.next("users"),
        /No load balancing strategy/
    );
});

test("next() respects excluded servers", () => {
    const pool = createPool();

    const lb = new LoadBalancer(pool);

    lb.loadStrategies({
        users: {
            strategy: "roundRobin",
        },
    });

    const servers =
        pool.getServersForService("users");

    const excluded = new Set([
        servers[0],
    ]);

    const selected =
        lb.next(
            "users",
            excluded
        );

    assert.equal(
        selected,
        servers[1]
    );
});

test("next() returns null when all servers are unhealthy", () => {
    const pool = createPool();

    pool
        .getServersForService("users")
        .forEach(server =>
            server.markUnhealthy()
        );

    const lb = new LoadBalancer(pool);

    lb.loadStrategies({
        users: {
            strategy: "roundRobin",
        },
    });

    assert.equal(
        lb.next("users"),
        null
    );
});