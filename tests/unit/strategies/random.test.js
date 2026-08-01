import test from "node:test";
import assert from "node:assert/strict";

import { RandomStrategy } from "../../../src/upstream/algorithms/random.js";
import { UpstreamServer } from "../../../src/upstream/server.js";

function createServers() {
    return [
        new UpstreamServer("users", "host1", 8001),
        new UpstreamServer("users", "host2", 8002),
        new UpstreamServer("users", "host3", 8003),
    ];
}

test("always returns one of the healthy servers", () => {
    const strategy = new RandomStrategy();

    const servers = createServers();

    for (let i = 0; i < 100; i++) {
        const chosen = strategy.next(servers);

        assert.ok(
            servers.includes(chosen)
        );
    }
});

test("never returns unhealthy server", () => {
    const strategy = new RandomStrategy();

    const servers = createServers();

    servers[1].markUnhealthy();

    for (let i = 0; i < 100; i++) {
        const chosen = strategy.next(servers);

        assert.notEqual(
            chosen,
            servers[1]
        );
    }
});

test("never returns excluded server", () => {
    const strategy = new RandomStrategy();

    const servers = createServers();

    const excluded = new Set([
        servers[0],
        servers[2],
    ]);

    for (let i = 0; i < 20; i++) {
        assert.equal(
            strategy.next(
                servers,
                excluded
            ),
            servers[1]
        );
    }
});

test("returns null if no eligible servers exist", () => {
    const strategy = new RandomStrategy();

    const servers = createServers();

    servers.forEach(server =>
        server.markUnhealthy()
    );

    assert.equal(
        strategy.next(servers),
        null
    );
});