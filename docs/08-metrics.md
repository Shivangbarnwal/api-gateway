# Metrics and Logging

## Purpose

The gateway exposes a lightweight, process-local view of traffic and cache behavior. It also emits a structured human-readable log line when middleware unwinds after a request completes.

## Metrics lifecycle

`Application.handle()` calls `metricsCollector.recordRequest()` before creating the middleware chain. It captures a high-resolution start time with `performance.now()` and registers a one-time `finish` listener on the Node response object. At finish, it records the final status code and elapsed latency.

The router increments a service-specific counter after resolving a configured service. Cache middleware separately records hits, misses, and stores.

```mermaid
flowchart LR
    Request --> Total[totalRequests]
    Routing --> Service[serviceRequests]
    Cache --> CacheCounters[hits / misses / stores]
    ResponseFinish --> Status[statusCodes]
    ResponseFinish --> Latency[total latency and count]
    Total --> Snapshot[/metrics JSON]
    Service --> Snapshot
    CacheCounters --> Snapshot
    Status --> Snapshot
    Latency --> Snapshot
```

## Endpoint and schema

`/metrics` is handled by router middleware before service matching. It returns `200` JSON for any HTTP method after the request has passed rate limiting and authentication.

```json
{
  "totalRequests": 0,
  "statusCodes": {},
  "averageLatencyMs": 0,
  "serviceRequests": {},
  "cache": {
    "hits": 0,
    "misses": 0,
    "stores": 0
  }
}
```

`averageLatencyMs` is computed from completed responses as `totalLatency / requestCount`; it is `0` before any response has finished. The `/metrics` request itself increments total request count at application entry, but its status and latency records occur when that response finishes.

## Logging

`middleware/logger.js` measures duration around `await next()`. It assigns levels by final status:

| Status range | Level |
|---|---|
| 500 and above | `ERROR` |
| 400–499 | `WARN` |
| Below 400 | `INFO` |

The log includes ISO timestamp, request ID, HTTP method, URL, selected upstream (or `-`), status code, and measured duration. An upstream appears only after the proxy selects it; early rejections therefore log `-`.

## Administrative and runtime visibility

`GET /admin/services` supplements aggregate metrics with per-instance health and active connection data. It requires an administrator token. There is no endpoint to reset metrics, although `MetricsCollector` provides a `reset()` method for programmatic and test use.

## Design decisions

- **Record on `finish`:** status and latency reflect the response that was actually ended by the gateway.
- **Keep collection small:** counters are simple enough to inspect without a monitoring dependency.
- **Use request IDs in proxy and logs:** clients and upstreams can correlate a forwarded request through `x-request-id`.

## Current limitations

- Metrics reset at restart and are not aggregated across replicas.
- No Prometheus exposition format, labels, histograms, percentiles, or scraping authentication model exists.
- Metric objects grow with distinct status codes and service names.
- Logging uses `console.log` only; there is no structured JSON sink, log sampling, or correlation with a tracing system.

Metrics collector unit tests verify each counter, average calculation, cache counters, and reset behavior. Integration tests verify endpoint shape; see [testing](09-testing.md).
