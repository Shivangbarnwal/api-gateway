export class MemoryCache {
  constructor() {
    this.cache = new Map();
  }

  get(key) {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (entry.isExpired()) {
      this.cache.delete(key);
      return null;
    }

    return entry;
  }

  set(key, entry) {
    this.cache.set(key, entry);
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  has(key) {
    return this.get(key) !== null;
  }

  size() {
    return this.cache.size;
  }
}