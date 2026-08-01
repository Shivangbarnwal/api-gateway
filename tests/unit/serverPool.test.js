import test from "node:test";
import assert from "node:assert/strict";

import { ServerPool } from "../../src/upstream/serverPool.js";
import { UpstreamServer } from "../../src/upstream/server.js";

test("addServer() registers a server", () => {
    const pool = new ServerPool();

    const server = new UpstreamServer(
        "users",
        "localhost",
        8001
    );

    pool.addServer(server);

    assert.equal(
        pool.getServers().length,
        1
    );

    assert.equal(
        pool.getServersForService("users").length,
        1
    );
});

test("getServersForService() returns empty array for unknown service", () => {
    const pool = new ServerPool();

    assert.deepEqual(
        pool.getServersForService("unknown"),
        []
    );
});

test("loadServices() loads all configured servers", () => {
    const pool = new ServerPool();

    pool.loadServices({
        users: {
            instances: [
                {
                    host: "localhost",
                    port: 8001,
                },
                {
                    host: "localhost",
                    port: 8002,
                },
            ],
        },
        products: {
            instances: [
                {
                    host: "localhost",
                    port: 8003,
                },
            ],
        },
    });

    assert.equal(
        pool.getServers().length,
        3
    );

    assert.equal(
        pool.getServersForService("users").length,
        2
    );

    assert.equal(
        pool.getServersForService("products").length,
        1
    );
});

test("loadServices() replaces previous pool state", () => {
    const pool = new ServerPool();

    pool.loadServices({
        users: {
            instances: [
                {
                    host: "localhost",
                    port: 8001,
                },
            ],
        },
    });

    pool.loadServices({
        products: {
            instances: [
                {
                    host: "localhost",
                    port: 9001,
                },
            ],
        },
    });

    assert.equal(
        pool.getServersForService("users").length,
        0
    );

    assert.equal(
        pool.getServersForService("products").length,
        1
    );
});

test("getSnapshot() reflects current pool state", () => {
    const pool = new ServerPool();

    pool.loadServices({
        users: {
            instances: [
                {
                    host: "localhost",
                    port: 8001,
                },
            ],
        },
    });

    const snapshot = pool.getSnapshot();

    assert.equal(
        snapshot.users.length,
        1
    );

    assert.equal(
        snapshot.users[0].host,
        "localhost"
    );

    assert.equal(
        snapshot.users[0].port,
        8001
    );
});