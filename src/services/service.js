export class Service {
  constructor(name, config = {}) {
    this.name = name;

    this.strategy = config.strategy;

    this.cache = config.cache ?? {
      enabled: false,
      ttl: 0,
    };

    this.instances = config.instances ?? [];
  }
}