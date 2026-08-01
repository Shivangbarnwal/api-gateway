# Reverse Proxy

## Purpose

The reverse proxy is the terminal middleware for a routed cache miss or a non-cacheable request. It forwards the incoming request to an eligible upstream, streams the upstream response to the client, and coordinates request-time retry behavior.

## Request forwarding

`forwardRequest(ctx)` first reads the complete incoming request body into a `Buffer`. It then asks the load balancer for a server associated with `ctx.service.name` and invokes `attemptRequest()`.

The upstream request uses:

| Field | Source |
|---|---|
| Host and port | Selected `UpstreamServer` |
| Path | Original `ctx.req.url` |
| Method | Original `ctx.req.method` |
| Headers | Original request headers plus `x-request-id` |
| Body | Buffered original request body, if non-empty |

The proxy does not rewrite paths, remove hop-by-hop headers, add an `X-Forwarded-*` header, or alter the request method.

## Response handling

```mermaid
sequenceDiagram
    participant C as Client
    participant G as Gateway proxy
    participant U as Upstream

    C->>G: Request
    G->>G: Buffer request body; select server
    G->>U: HTTP request + x-request-id
    U-->>G: Status and headers
    G->>G: Copy response status and headers
    U-->>G: Response stream
    G-->>C: Pipe response stream
    G->>G: Decrement connection count on finish
```

When an upstream responds, the proxy copies its status code and every defined response header to the gateway response. It then pipes the upstream response stream directly to the client response. Cache middleware, when active, wraps gateway writes around this path to capture a successful response.

## Failure behavior

Each proxy request tracks a `Set` of attempted servers. A connection error marks that server unhealthy, assigns a `502` status and client message, decrements its connection count, and tries another eligible server. The request timeout callback destroys the upstream request with an `ETIMEDOUT` error; that error maps to `504` and can also lead to another attempt.

| Condition | Initial result | Final client result when no retry succeeds |
|---|---|---|
| No healthy server before first attempt | No attempt | `503 Service Unavailable` |
| Connection error | Mark server unhealthy; retry | `502 Bad Gateway` |
| Upstream timeout | Retry without marking unhealthy | `504 Gateway Timeout` |

Application-level error handling is a final safety net. If middleware throws before ending a response, it uses `err.statusCode` when present, but labels only `502` errors as `Bad Gateway`; other errors use the `Internal Server Error` label. Normal proxy failures are handled inside `forwardRequest()` before that fallback is needed.

## Important modules

| Module | Role |
|---|---|
| `upstream/proxy.js` | Singleton pool/load balancer initialization, body reading, attempts, retries, and error translation. |
| `middleware/proxy.js` | Calls `forwardRequest()` as terminal middleware. |
| `upstream/server.js` | Tracks the selected instance and connection accounting. |
| `core/application.js` | Creates context and records final response metrics. |

## Design decisions

- **Native streaming response:** avoids an unnecessary full response buffer in ordinary proxy paths.
- **Buffered request body:** permits the same payload to be written again for a retry attempt.
- **Full header copy:** preserves upstream response metadata in the simple demo topology.
- **Request ID propagation:** gives upstream services a gateway-generated correlation value.

## Current limitations

- Request bodies are fully buffered in memory; no streaming upload or size limit is implemented.
- Retries can repeat non-idempotent methods because retry eligibility is based on failure, not HTTP method.
- The proxy does not handle WebSocket tunneling despite cache middleware detecting upgrade requests.
- No abort handling, TLS upstream configuration, custom DNS lookup, connection agent, or retry backoff is configured.
- Forwarding all request/response headers without hop-by-hop filtering is suitable for this learning project but not a complete proxy policy.

Read [load balancing](03-load-balancer.md) and [health checks](07-health-checks.md) for selection and eligibility behavior.
