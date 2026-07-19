export class ServiceRegistry {
  constructor() {
    this.services = new Map();
  }

  register(service) {
    this.services.set(service.name, service);
  }

  get(name) {
    return this.services.get(name) ?? null;
  }
    has(name) {
    return this.services.has(name);
  }

  getAll() {
    return [...this.services.values()];
  }
}