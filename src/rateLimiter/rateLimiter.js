export class RateLimiter {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.clients = new Map();
  }

  allow(clientId) {
    const now = Date.now();

    const client = this.clients.get(clientId);

    if (!client) {
        this.clients.set(clientId, {
            count: 1,
            windowStart: now,
        });

        return true;
    }
    if (now - client.windowStart >= this.windowMs) {
        client.count = 1;
        client.windowStart = now;

        return true;
    }
    if (client.count < this.limit) {
        client.count++;
        return true;
    }
    return false;
  }
}