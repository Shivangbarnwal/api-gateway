import test from "node:test";
import assert from "node:assert/strict";

import { MetricsCollector } from "../../src/metrics/metricsCollector.js";

test("recordRequest() increments total requests", () => {
    const metrics = new MetricsCollector();

    metrics.recordRequest();
    metrics.recordRequest();

    assert.equal(
        metrics.getMetrics().totalRequests,
        2
    );
});

test("recordStatusCode() counts responses correctly", () => {
    const metrics = new MetricsCollector();

    metrics.recordStatusCode(200);
    metrics.recordStatusCode(200);
    metrics.recordStatusCode(404);

    const snapshot = metrics.getMetrics();

    assert.equal(snapshot.statusCodes[200], 2);
    assert.equal(snapshot.statusCodes[404], 1);
});

test("recordLatency() computes average latency", () => {
    const metrics = new MetricsCollector();

    metrics.recordLatency(100);
    metrics.recordLatency(200);
    metrics.recordLatency(300);

    assert.equal(
        metrics.getMetrics().averageLatencyMs,
        200
    );
});

test("average latency is zero initially", () => {
    const metrics = new MetricsCollector();

    assert.equal(
        metrics.getMetrics().averageLatencyMs,
        0
    );
});

test("recordService() tracks requests per service", () => {
    const metrics = new MetricsCollector();

    metrics.recordService("users");
    metrics.recordService("users");
    metrics.recordService("products");

    const snapshot = metrics.getMetrics();

    assert.equal(snapshot.serviceRequests.users, 2);
    assert.equal(snapshot.serviceRequests.products, 1);
});

test("cache metrics are tracked correctly", () => {
    const metrics = new MetricsCollector();

    metrics.recordCacheHit();
    metrics.recordCacheHit();

    metrics.recordCacheMiss();

    metrics.recordCacheStore();
    metrics.recordCacheStore();

    const snapshot = metrics.getMetrics();

    assert.equal(snapshot.cache.hits, 2);
    assert.equal(snapshot.cache.misses, 1);
    assert.equal(snapshot.cache.stores, 2);
});

test("reset() clears every metric", () => {
    const metrics = new MetricsCollector();

    metrics.recordRequest();
    metrics.recordStatusCode(200);
    metrics.recordLatency(150);
    metrics.recordService("users");
    metrics.recordCacheHit();
    metrics.recordCacheMiss();
    metrics.recordCacheStore();

    metrics.reset();

    const snapshot = metrics.getMetrics();

    assert.equal(snapshot.totalRequests, 0);
    assert.equal(snapshot.averageLatencyMs, 0);

    assert.deepEqual(snapshot.statusCodes, {});
    assert.deepEqual(snapshot.serviceRequests, {});

    assert.equal(snapshot.cache.hits, 0);
    assert.equal(snapshot.cache.misses, 0);
    assert.equal(snapshot.cache.stores, 0);
});