import test from "node:test";
import assert from "node:assert/strict";

import { UpstreamServer } from "../../src/upstream/server.js";

test("constructor initializes server correctly", () => {
    const server = new UpstreamServer(
        "users",
        "localhost",
        8001
    );

    assert.equal(server.service, "users");
    assert.equal(server.host, "localhost");
    assert.equal(server.port, 8001);

    assert.equal(server.isHealthy(), true);
    assert.equal(server.getActiveConnections(), 0);
});

test("markUnhealthy() marks server unhealthy", () => {
    const server = new UpstreamServer(
        "users",
        "localhost",
        8001
    );

    server.markUnhealthy();

    assert.equal(server.isHealthy(), false);
});

test("markHealthy() restores healthy state", () => {
    const server = new UpstreamServer(
        "users",
        "localhost",
        8001
    );

    server.markUnhealthy();
    server.markHealthy();

    assert.equal(server.isHealthy(), true);
});

test("incrementConnections() increases active connections", () => {
    const server = new UpstreamServer(
        "users",
        "localhost",
        8001
    );

    server.incrementConnections();
    server.incrementConnections();

    assert.equal(
        server.getActiveConnections(),
        2
    );
});

test("decrementConnections() decreases active connections", () => {
    const server = new UpstreamServer(
        "users",
        "localhost",
        8001
    );

    server.incrementConnections();
    server.incrementConnections();

    server.decrementConnections();

    assert.equal(
        server.getActiveConnections(),
        1
    );
});

test("active connections never become negative", () => {
    const server = new UpstreamServer(
        "users",
        "localhost",
        8001
    );

    server.decrementConnections();

    assert.equal(
        server.getActiveConnections(),
        0
    );
});

test("getSnapshot() returns server state", () => {
    const server = new UpstreamServer(
        "users",
        "localhost",
        8001
    );

    server.incrementConnections();

    assert.deepEqual(
        server.getSnapshot(),
        {
            host: "localhost",
            port: 8001,
            healthy: true,
            activeConnections: 1,
        }
    );
});