# Cache Benchmark

## Environment

- Service: users
- Concurrent Connections: 50
- Duration: 20 seconds
- Cache TTL: 10 seconds

---

## Cold Cache

Command:

```bash
DELETE /admin/cache
npm run benchmark:users
```

### Benchmark Results

| Metric | Value |
|---------|------:|
| Total Requests | 59,335 |
| Requests/sec | 2,964.75 |
| Average Latency | 16.37 ms |
| Throughput | 1.33 MB/s |

### Cache Metrics

| Metric | Value |
|---------|------:|
| Hits | 59,265 |
| Misses | 70 |
| Stores | 70 |

---

## Warm Cache

Command:

```bash
npm run benchmark:users
```

### Benchmark Results

| Metric | Value |
|---------|------:|
| Total Requests | 56,000 |
| Requests/sec | 2,795.60 |
| Average Latency | 17.37 ms |
| Throughput | 1.25 MB/s |

### Cache Metrics

| Metric | Value |
|---------|------:|
| Hits | 55,894 |
| Misses | 57 |
| Stores | 57 |

---

## Observation

- After the cache was cleared, the first batch of concurrent requests populated the cache.
- Due to 50 concurrent clients starting simultaneously, multiple requests reached the backend before the first cached response was available, resulting in several cache misses instead of just one.
- Once the cache was populated, the vast majority of subsequent requests were served directly from memory.
- The benchmark confirms that the cache middleware correctly stores and serves cached responses under concurrent load.