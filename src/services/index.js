import { Service } from "./service.js";
import { ServiceRegistry } from "./serviceRegistry.js";

const registry = new ServiceRegistry();

const serviceNames = [
  "users",
  "products",
  "payments",
];

for (const name of serviceNames) {
  registry.register(new Service(name));
}

export default registry;