import { createStrategy } from "./strategyFactory.js";

export class LoadBalancer {
  constructor(serverPool) {
    this.serverPool = serverPool;
    this.strategies = new Map();
  }
  loadStrategies(configServices) {
    this.strategies.clear();

    for (const [serviceName, serviceConfig] of Object.entries(configServices)) {
        this.strategies.set(
            serviceName,
            createStrategy(serviceConfig.strategy)
        );
    }
  }
  next(serviceName, excludedServers = new Set()) {
    const strategy = this.strategies.get(serviceName);
    if (!strategy) {
      throw new Error(`No load balancing strategy configured for service: ${serviceName}`);
    }
    return strategy.next(
      this.serverPool.getServersForService(serviceName),
      excludedServers
    );
  }
}