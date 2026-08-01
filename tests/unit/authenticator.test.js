import test from "node:test";
import assert from "node:assert/strict";

import { Authenticator } from "../../src/auth/authenticator.js";

test("authenticate() accepts valid admin token", () => {
    const auth = new Authenticator();

    const result = auth.authenticate("admin-token");

    assert.equal(result.authenticated, true);
    assert.equal(result.user.role, "admin");
    assert.equal(result.user.name, "Admin");
});

test("authenticate() accepts valid user token", () => {
    const auth = new Authenticator();

    const result = auth.authenticate("user-token");

    assert.equal(result.authenticated, true);
    assert.equal(result.user.role, "user");
    assert.equal(result.user.name, "User");
});

test("authenticate() rejects invalid token", () => {
    const auth = new Authenticator();

    const result = auth.authenticate("invalid-token");

    assert.deepEqual(result, {
        authenticated: false,
    });
});

test("authenticate() rejects undefined token", () => {
    const auth = new Authenticator();

    const result = auth.authenticate(undefined);

    assert.deepEqual(result, {
        authenticated: false,
    });
});

test("authenticate() rejects empty token", () => {
    const auth = new Authenticator();

    const result = auth.authenticate("");

    assert.deepEqual(result, {
        authenticated: false,
    });
});