export class CacheEntry {
  constructor({
    statusCode,
    headers,
    body,
    expiresAt,
  }) {
    this.statusCode = statusCode;
    this.headers = headers;
    this.body = body;
    this.expiresAt = expiresAt;
  }

  isExpired() {
    return Date.now() >= this.expiresAt;
  }
}