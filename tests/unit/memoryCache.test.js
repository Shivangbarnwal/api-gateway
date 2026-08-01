import test from "node:test";
import assert from "node:assert/strict";

import { MemoryCache } from "../../src/cache/memoryCache.js";
import { CacheEntry } from "../../src/cache/cacheEntry.js";

function createEntry(ttl = 10000) {
    return new CacheEntry({
        statusCode: 200,
        headers: {},
        body: Buffer.from("cached"),
        expiresAt: Date.now() + ttl,
    });
}

test("set() stores entry", () => {
    const cache = new MemoryCache();

    cache.set("key", createEntry());

    assert.equal(
        cache.has("key"),
        true
    );
});

test("get() retrieves stored entry", () => {
    const cache = new MemoryCache();

    const entry = createEntry();

    cache.set("key", entry);

    assert.equal(
        cache.get("key"),
        entry
    );
});

test("expired entries are removed automatically", () => {
    const cache = new MemoryCache();

    cache.set(
        "key",
        new CacheEntry({
            statusCode: 200,
            headers: {},
            body: Buffer.from("expired"),
            expiresAt: Date.now() - 1,
        })
    );

    assert.equal(
        cache.get("key"),
        null
    );

    assert.equal(
        cache.size(),
        0
    );
});

test("delete() removes entry", () => {
    const cache = new MemoryCache();

    cache.set("key", createEntry());

    cache.delete("key");

    assert.equal(
        cache.has("key"),
        false
    );
});

test("clear() removes every entry", () => {
    const cache = new MemoryCache();

    cache.set("a", createEntry());
    cache.set("b", createEntry());

    cache.clear();

    assert.equal(
        cache.size(),
        0
    );
});

test("size() returns number of cached entries", () => {
    const cache = new MemoryCache();

    cache.set("a", createEntry());
    cache.set("b", createEntry());

    assert.equal(
        cache.size(),
        2
    );
});