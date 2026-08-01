import test from "node:test";
import assert from "node:assert/strict";

import { LeastConnections } from "../../../src/upstream/algorithms/leastConnections.js";
import { UpstreamServer } from "../../../src/upstream/server.js";

function createServers() {
    return [
        new UpstreamServer("users", "host1", 8001),
        new UpstreamServer("users", "host2", 8002),
        new UpstreamServer("users", "host3", 8003),
    ];
}

test("returns server with fewest active connections", () => {
    const strategy = new LeastConnections();

    const servers = createServers();

    servers[0].incrementConnections();
    servers[0].incrementConnections();

    servers[1].incrementConnections();

    assert.equal(
        strategy.next(servers),
        servers[2]
    );
});

test("ignores unhealthy servers", () => {
    const strategy = new LeastConnections();

    const servers = createServers();

    servers[2].markUnhealthy();

    assert.equal(
        strategy.next(servers),
        servers[0]
    );
});

test("ignores excluded servers", () => {
    const strategy = new LeastConnections();

    const servers = createServers();

    const excluded = new Set([
        servers[0],
    ]);

    assert.equal(
        strategy.next(
            servers,
            excluded
        ),
        servers[1]
    );
});

test("returns null if no server is available", () => {
    const strategy = new LeastConnections();

    const servers = createServers();

    servers.forEach(server =>
        server.markUnhealthy()
    );

    assert.equal(
        strategy.next(servers),
        null
    );
});