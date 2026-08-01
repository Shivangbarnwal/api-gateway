# Load Balancer Benchmark

## Objective

The objective of this benchmark is to verify that the gateway correctly distributes requests according to the configured load balancing strategy.

---

## Environment

- Backend Instances: 2 (`users-1`, `users-2`)
- Gateway running inside Docker
- Healthy backend instances only
- Cache: **Disabled**
- Benchmark Requests: **1000**
- Concurrent Workers: **50**

---

## Why was cache disabled?

The cache middleware was temporarily disabled for the `users` service before running this benchmark.

If caching were enabled, most requests would be served directly from the gateway's memory without reaching the backend servers. In that case, the load balancer would only process the initial cache misses, making it impossible to accurately measure request distribution between backend instances.

Disabling the cache ensures that **every request passes through the load balancer**, allowing the routing strategy to be evaluated correctly.

---

## Benchmark Method

A custom benchmark script (`benchmarks/loadBalancerBenchmark.js`) was used.

The script:

- Sends **1000 HTTP requests** to the gateway.
- Uses **50 concurrent workers**.
- Reads the backend instance (`instance`) returned in each response.
- Counts how many requests were handled by each backend instance.
- Calculates the percentage distribution.

---

# Strategy 1 — Round Robin

Configuration:

```yaml
strategy: roundRobin
```

Expected Pattern:

```
users-1
users-2
users-1
users-2
users-1
users-2
...
```

Observed Distribution:

| Backend | Requests | Percentage |
|---------|---------:|-----------:|
| users-1 | 500 | 50.00% |
| users-2 | 500 | 50.00% |

### Observation

Round Robin cycles through the list of healthy backend servers in order.

Since both servers remained healthy throughout the benchmark, requests were distributed equally between them.

---

# Strategy 2 — Random

Configuration:

```yaml
strategy: random
```

Expected Pattern:

```
users-2
users-1
users-2
users-2
users-1
users-1
...
```

(No fixed order.)

Observed Distribution:

| Backend | Requests | Percentage |
|---------|---------:|-----------:|
| users-1 | 510 | 51.00% |
| users-2 | 490 | 49.00% |

### Observation

Each request is assigned to a randomly selected healthy backend instance.

Although the selection order is unpredictable, a large number of requests naturally results in an approximately even distribution.

---

# Strategy 3 — Least Connections

Configuration:

```yaml
strategy: leastConnections
```

Observed Distribution:

| Backend | Requests | Percentage |
|---------|---------:|-----------:|
| users-1 | 527 | 52.70% |
| users-2 | 473 | 47.30% |

### Observation

The Least Connections strategy always selects the healthy backend with the fewest active connections.

In this project, backend responses are very fast and both instances have identical performance. As requests complete quickly, both servers usually have a similar number of active connections, resulting in a distribution that is close to 50/50.

Unlike Round Robin, the order of requests is not predetermined. The selected server depends on the current connection count at the time each request arrives.

---

# Conclusion

The benchmark confirms that all implemented load balancing strategies behave as expected.

| Strategy | Behaviour |
|----------|-----------|
| Round Robin | Sequential and deterministic distribution across healthy servers. |
| Random | Requests are distributed randomly while remaining approximately balanced over a large sample size. |
| Least Connections | Requests are routed to the backend with the fewest active connections, producing a near-even distribution for equally capable servers. |

The benchmark demonstrates that the gateway correctly applies the configured routing strategy while maintaining balanced request distribution across healthy backend instances.