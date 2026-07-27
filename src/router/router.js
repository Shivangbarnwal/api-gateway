import { Route } from "./route.js";

export class Router {
  constructor() {
    this.routes = [];
  }

  register(prefix, service) {
    this.routes.push(new Route(prefix, service));
  }

  loadRoutes(configRoutes) {
    this.routes = [];

    for (const route of configRoutes) {
      this.register(route.path, route.service);
    }
  }
  getSnapshot() {
    return this.routes.map(route => ({
      path: route.prefix,
      service: route.service,
    }));
  }
  match(path) {
    for (const route of this.routes) {
      if (path.startsWith(route.prefix)) {
        return route.service;
      }
    }

    return null;
  }
}