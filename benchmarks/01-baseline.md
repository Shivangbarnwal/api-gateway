# Baseline Benchmark

## Environment

- Gateway: Docker
- Backend Instances: 6
- Concurrent Connections: 50
- Duration: 20 seconds
- Tool: autocannon

Command:

```bash
npm run benchmark:users
```

## Results

| Metric | Value |
|---------|------:|
| Total Requests | 103,000 |
| Requests/sec | 5,136 |
| Average Latency | 9.23 ms |
| Median Latency | 7 ms |
| P99 Latency | 34 ms |
| Maximum Latency | 971 ms |
| Throughput | 2.3 MB/s |

## Notes

- Rate limiting disabled during benchmarking.
- Gateway running inside Docker.
- Backend services running as Docker containers.
- Cache enabled for `/users`.