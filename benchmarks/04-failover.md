# Failover Benchmark

## Objective

The objective of this benchmark is to verify that the API Gateway automatically redirects requests to healthy backend instances when one or more servers become unavailable.

---

## Environment

- Backend Instances: 2 (`users-1`, `users-2`)
- Gateway running inside Docker
- Load Balancing Strategy: Round Robin
- Cache: Disabled
- Health Checks: Enabled

---

## Test Procedure

### Step 1

Start all containers.

```bash
docker compose up
```

Verify both backend instances are running.

```bash
docker ps
```

Expected:

```
users1
users2
gateway
...
```

---

### Step 2

Send requests through the gateway.

Example:

```http
GET /users
```

Observed responses:

```
users-1
users-2
users-1
users-2
...
```

Both backend instances receive traffic.

---

### Step 3

Stop one backend instance.

```bash
docker stop users1
```

Verify:

```bash
docker ps
```

Only `users2` remains running.

---

### Step 4

Continue sending requests.

Observed responses:

```
users-2
users-2
users-2
users-2
...
```

No failed requests were observed.

The gateway automatically excluded the unavailable backend and routed all traffic to the remaining healthy instance.

---

### Step 5

Restart the stopped backend.

```bash
docker start users1
```

Wait for the health check to mark the instance as healthy.

Continue sending requests.

Observed responses:

```
users-1
users-2
users-1
users-2
...
```

Traffic resumed across both backend instances.

---

# Observations

During the benchmark:

- No gateway restart was required.
- No configuration changes were required.
- Requests continued to be served successfully while one backend was unavailable.
- Once the backend recovered, it automatically rejoined the load balancing pool.

---

# Conclusion

The failover mechanism behaved as expected.

When a backend became unavailable:

- It was excluded from request routing.
- Remaining healthy instances continued serving traffic.
- Client requests completed successfully without manual intervention.

After recovery:

- The backend was automatically marked healthy.
- It resumed receiving traffic according to the configured load balancing strategy.

This demonstrates the gateway's ability to tolerate backend failures while maintaining service availability.