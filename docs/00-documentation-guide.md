# Documentation Guide

This directory documents the implementation as it exists in the repository. The gateway is intentionally built with Node.js core modules, so individual guides focus on the boundaries between middleware, configuration, and upstream communication.

## Reading paths

| If you need to understand… | Read |
|---|---|
| The end-to-end request model | [Architecture](01-architecture.md) |
| How YAML becomes a running gateway | [Configuration](11-configuration.md), then [Routing](02-routing.md) |
| How an upstream is chosen or retried | [Reverse Proxy](12-reverse-proxy.md), [Load Balancer](03-load-balancer.md), and [Health Checks](07-health-checks.md) |
| Request protection | [Authentication](05-authentication.md) and [Rate Limiter](06-rate-limiter.md) |
| Cached responses and runtime visibility | [Cache](04-cache.md) and [Metrics](08-metrics.md) |
| Local verification or measurements | [Testing](09-testing.md) and [Benchmarks](10-benchmarks.md) |
| Containerized execution | [Deployment](13-deployment.md) |

## Guide index

1. [Architecture](01-architecture.md)
2. [Routing](02-routing.md)
3. [Load Balancer](03-load-balancer.md)
4. [Cache](04-cache.md)
5. [Authentication and Administration](05-authentication.md)
6. [Rate Limiter](06-rate-limiter.md)
7. [Health Checks and Failover](07-health-checks.md)
8. [Metrics and Logging](08-metrics.md)
9. [Testing](09-testing.md)
10. [Benchmarks](10-benchmarks.md)
11. [Configuration and Validation](11-configuration.md)
12. [Reverse Proxy](12-reverse-proxy.md)
13. [Deployment](13-deployment.md)

The repository also preserves a manual [failover scenario](testing/failover.md) and recorded reports in [`../benchmarks/`](../benchmarks/). Those files describe particular test conditions and are not replaced by these guides.

## Source of truth

When documentation and runtime configuration differ, use the following order of authority:

1. The current source code under `src/` defines behavior.
2. `src/config/gateway.yaml` and required environment variables define the active configuration.
3. Benchmark reports document historical or scenario-specific measurements.

This matters for cache and load-balancer experiments, whose reports may intentionally use temporary settings that differ from the checked-in YAML.
