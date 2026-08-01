import test from "node:test";
import assert from "node:assert/strict";

import { RoundRobin } from "../../../src/upstream/algorithms/roundRobin.js";
import { UpstreamServer } from "../../../src/upstream/server.js";

function createServers() {
    return [
        new UpstreamServer("users", "host1", 8001),
        new UpstreamServer("users", "host2", 8002),
        new UpstreamServer("users", "host3", 8003),
    ];
}

test("cycles through servers in order", () => {
    const rr = new RoundRobin();
    const servers = createServers();

    assert.equal(rr.next(servers), servers[0]);
    assert.equal(rr.next(servers), servers[1]);
    assert.equal(rr.next(servers), servers[2]);
    assert.equal(rr.next(servers), servers[0]);
});

test("skips unhealthy servers", () => {
    const rr = new RoundRobin();
    const servers = createServers();

    servers[1].markUnhealthy();

    assert.equal(rr.next(servers), servers[0]);
    assert.equal(rr.next(servers), servers[2]);
    assert.equal(rr.next(servers), servers[0]);
});

test("returns null if every server is unhealthy", () => {
    const rr = new RoundRobin();
    const servers = createServers();

    servers.forEach(server => server.markUnhealthy());

    assert.equal(rr.next(servers), null);
});

test("skips excluded servers", () => {
    const rr = new RoundRobin();
    const servers = createServers();

    const excluded = new Set([
        servers[0],
        servers[1],
    ]);

    assert.equal(
        rr.next(servers, excluded),
        servers[2]
    );
});