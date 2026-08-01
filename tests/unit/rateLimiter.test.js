import test from "node:test";
import assert from "node:assert/strict";

import { RateLimiter } from "../../src/rateLimiter/rateLimiter.js";

test("first request from new client is allowed", () => {
    const limiter = new RateLimiter(5, 1000);

    assert.equal(
        limiter.allow("client1"),
        true
    );
});

test("requests within limit are allowed", () => {
    const limiter = new RateLimiter(3, 1000);

    assert.equal(limiter.allow("client1"), true);
    assert.equal(limiter.allow("client1"), true);
    assert.equal(limiter.allow("client1"), true);
});

test("request exceeding limit is rejected", () => {
    const limiter = new RateLimiter(2, 1000);

    limiter.allow("client1");
    limiter.allow("client1");

    assert.equal(
        limiter.allow("client1"),
        false
    );
});

test("different clients have independent limits", () => {
    const limiter = new RateLimiter(2, 1000);

    limiter.allow("client1");
    limiter.allow("client1");

    assert.equal(
        limiter.allow("client2"),
        true
    );
});

test("window reset allows requests again", async () => {
    const limiter = new RateLimiter(2, 50);

    limiter.allow("client1");
    limiter.allow("client1");

    assert.equal(
        limiter.allow("client1"),
        false
    );

    await new Promise(resolve =>
        setTimeout(resolve, 60)
    );

    assert.equal(
        limiter.allow("client1"),
        true
    );
});