import { Route } from "./route.js";

export class Router {
  constructor() {
    this.routes = [];
  }

  register(prefix, service) {
    this.routes.push(new Route(prefix, service));
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