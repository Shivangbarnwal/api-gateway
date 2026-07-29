export function validateGatewayConfig(config) {

  validateRoutes(config);

  validateDuplicateRoutes(config);

  validateServices(config);

}


function validateRoutes(config) {

  if (!Array.isArray(config.routes)) {
    throw new Error(
      "routes must be an array"
    );
  }


  for (const route of config.routes) {

    if (!route.path) {
      throw new Error(
        "Route is missing path"
      );
    }


    if (!route.service) {
      throw new Error(
        `Route '${route.path}' is missing service`
      );
    }


    if (
      !config.services ||
      !config.services[route.service]
    ) {
      throw new Error(
        `Route '${route.path}' references unknown service '${route.service}'`
      );
    }

  }

}

function validateDuplicateRoutes(config) {

  const paths = new Set();


  for (const route of config.routes) {

    if (paths.has(route.path)) {

      throw new Error(
        `Duplicate route path '${route.path}'`
      );

    }


    paths.add(route.path);

  }

}

function validateServices(config) {

  if (!config.services) {
    throw new Error(
      "services configuration missing"
    );
  }


  for (
    const [serviceName, service]
    of Object.entries(config.services)
  ) {

    validateStrategy(
      serviceName,
      service
    );


    validateCache(
      serviceName,
      service
    );


    validateInstances(
      serviceName,
      service
    );

    validateDuplicateInstances(
      serviceName,
      service
    );

  }

}



function validateStrategy(serviceName, service) {

  const allowedStrategies = [
    "roundRobin",
    "random",
    "leastConnections",
  ];


  if (
    !allowedStrategies.includes(
      service.strategy
    )
  ) {

    throw new Error(
      `Service '${serviceName}' has invalid strategy '${service.strategy}'`
    );

  }

}



function validateCache(serviceName, service) {

  if (!service.cache) {

    throw new Error(
      `Service '${serviceName}' is missing cache configuration`
    );

  }


  if (
    typeof service.cache.enabled !== "boolean"
  ) {

    throw new Error(
      `Service '${serviceName}' cache.enabled must be true or false`
    );

  }


  if (
    typeof service.cache.ttl !== "number" ||
    service.cache.ttl <= 0
  ) {

    throw new Error(
      `Service '${serviceName}' cache.ttl must be greater than 0`
    );

  }

}



function validateInstances(serviceName, service) {

  if (
    !Array.isArray(service.instances) ||
    service.instances.length === 0
  ) {

    throw new Error(
      `Service '${serviceName}' must have at least one instance`
    );

  }


  for (const instance of service.instances) {

    if (!instance.host) {

      throw new Error(
        `Service '${serviceName}' instance missing host`
      );

    }


    if (!instance.port) {

      throw new Error(
        `Service '${serviceName}' instance missing port`
      );

    }

  }

}
function validateDuplicateInstances(
  serviceName,
  service
) {

  const seen = new Set();

  for (const instance of service.instances) {

    const key =
      `${instance.host}:${instance.port}`;

    if (seen.has(key)) {

      throw new Error(
        `Service '${serviceName}' has duplicate instance '${key}'`
      );

    }

    seen.add(key);

  }

}