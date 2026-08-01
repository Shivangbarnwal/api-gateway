# Testing

## Purpose

The project separates deterministic component tests from HTTP-level integration checks. It uses Node's built-in `node:test` runner and `node:assert/strict`; no external test framework is required.

## Commands

| Command | Declared behavior |
|---|---|
| `npm test` | Runs `node --test`. |
| `npm run test:integration` | Runs the integration-test glob. |
| `npm run test:all` | Runs `node --test tests`. |

Integration tests make actual requests to `localhost:8080`. Start the gateway and its configured upstream services first, normally with:

```bash
docker compose -f docker/docker-compose.yml up --build
```

The tests share the running process state. Rate-limit counters, cache entries, and metrics can therefore be influenced by earlier integration tests or manual traffic.

## Unit coverage

Unit tests instantiate components directly and cover their observable behavior.

| Area | Covered behavior |
|---|---|
| Authentication | Valid and invalid token results. |
| Cache | Cache entry expiry; storage, deletion, clearing, and lazy expiry. |
| Metrics | Counters, average latency, cache metrics, and reset. |
| Rate limiter | First request, limit exhaustion, separate clients, and window reset. |
| Router | Registration, loading replacement, prefix matching, and no-match handling. |
| Services | Registry lookup and service enumeration. |
| Server pool | Adding, loading, replacing, and snapshotting upstream servers. |
| Upstream server | Health transitions, connection counting, and snapshots. |
| Load balancer | Strategy setup, exclusions, unknown strategy, and no healthy server. |
| Strategies | Round-robin progression, random eligibility, and least-connections selection. |

## Integration coverage

`tests/helpers/request.js` is a small Node HTTP client used by integration tests. It supplies the bearer header and returns status, headers, and body.

| File | Scenario |
|---|---|
| `basicFlow.test.js` | A `/users` request reaches a backend. |
| `routing.test.js` | Users, products, payments, and unknown routes. |
| `auth.test.js` | User/admin tokens and unauthorized requests. |
| `admin.test.js` | Role-protected administration access. |
| `rateLimiter.test.js` | Eventual `429` and post-window recovery. |
| `metrics.test.js` | Metrics endpoint response shape. |
| `cache.test.js` | Storage, hits, POST bypass, clearing, and expiry scenario. |
| `failover.test.js` | A healthy users instance is reachable through the gateway. |

The current `failover.test.js` verifies availability from one of the two users instances; it does not itself stop a container. Manual stop/restart scenarios are documented in [`testing/failover.md`](testing/failover.md).

## Test design notes

- Unit tests avoid production singletons where possible by constructing fresh objects.
- Integration checks test the externally visible HTTP response, rather than invoking middleware directly.
- Several integration cases rely on configured TTL and rate-window timing, so they deliberately wait for the expected window to elapse.

## Current limitations

- There is no automated test bootstrap/teardown for the gateway or Docker stack.
- Integration tests are stateful and may be order-sensitive in a shared running process.
- No dedicated tests cover configuration validation, health-check scheduling, proxy timeout behavior, request-body forwarding, logger output, or the complete failure/recovery sequence.
- Cache integration expectations describe users caching, whereas the checked-in YAML currently enables cache only for payments; run configuration must match the scenario being evaluated.

Use this distinction when interpreting failures: unit failures identify component behavior, while integration failures may also reflect an unavailable local deployment or its active configuration.
