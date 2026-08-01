import test from "node:test";
import assert from "node:assert/strict";

import { CacheEntry } from "../../src/cache/cacheEntry.js";

test("entry is valid before expiry", () => {
    const entry = new CacheEntry({
        statusCode: 200,
        headers: {},
        body: Buffer.from("hello"),
        expiresAt: Date.now() + 10000,
    });

    assert.equal(
        entry.isExpired(),
        false
    );
});

test("entry expires correctly", () => {
    const entry = new CacheEntry({
        statusCode: 200,
        headers: {},
        body: Buffer.from("hello"),
        expiresAt: Date.now() - 1,
    });

    assert.equal(
        entry.isExpired(),
        true
    );
});