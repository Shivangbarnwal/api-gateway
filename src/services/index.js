import config from "../config/config.js";
import { Service } from "./service.js";
import { ServiceRegistry } from "./serviceRegistry.js";

const registry = new ServiceRegistry();

for (const serviceName of Object.keys(config.services)) {
  registry.register(new Service(serviceName));
}

export default registry;