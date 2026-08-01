import test from "node:test";
import assert from "node:assert/strict";

import { ServiceRegistry } from "../../src/services/serviceRegistry.js";
import { Service } from "../../src/services/service.js";

test("register and retrieve service", () => {
    const registry = new ServiceRegistry();

    const service = new Service("users");

    registry.register(service);

    assert.equal(
        registry.get("users"),
        service
    );
});

test("returns null for unknown service", () => {
    const registry = new ServiceRegistry();

    assert.equal(
        registry.get("unknown"),
        null
    );
});

test("has() reports correctly", () => {
    const registry = new ServiceRegistry();

    registry.register(
        new Service("payments")
    );

    assert.equal(
        registry.has("payments"),
        true
    );

    assert.equal(
        registry.has("users"),
        false
    );
});

test("getAll() returns every registered service", () => {
    const registry = new ServiceRegistry();

    registry.register(new Service("users"));
    registry.register(new Service("products"));

    assert.equal(
        registry.getAll().length,
        2
    );
});