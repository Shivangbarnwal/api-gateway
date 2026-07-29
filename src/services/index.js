import config from "../config/config.js";
import { Service } from "./service.js";
import { ServiceRegistry } from "./serviceRegistry.js";

const registry = new ServiceRegistry();

for (const [serviceName, serviceConfig] of Object.entries(config.services)) {
  registry.register(
    new Service(serviceName, serviceConfig)
  );
}

export default registry;