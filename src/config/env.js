import dotenv from "dotenv";

dotenv.config();

function getEnv(name, options = {}) {
  const value = process.env[name];

  if (value === undefined || value === "") {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }
  const type = options.type ?? "string";
  if (type === "number") {
    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
        throw new Error(
            `Invalid value for ${name}: expected a number`
        );
    }
    if (
        options.min !== undefined &&
        parsed < options.min
    ) {
        throw new Error(
            `${name} must be at least ${options.min}`
        );
    }

    if (
        options.max !== undefined &&
        parsed > options.max
    ) {
        throw new Error(
            `${name} must be at most ${options.max}`
        );
    }
    return parsed;
  }
  if (
    options.allowed &&
    !options.allowed.includes(value)
  ) {
    throw new Error(
        `Invalid value for ${name}. Allowed values: ${options.allowed.join(", ")}`
    );
  }
  return value;
}
const config = {
    server: {
    port: getEnv("PORT", {
        type: "number",
        min: 1,
        max: 65535,
    }),
    },

    proxy: {
    timeout: getEnv("UPSTREAM_TIMEOUT", {
        type: "number",
        min: 1,
    }),
    },

    health: {
    interval: getEnv("HEALTH_INTERVAL", {
        type: "number",
        min: 1000,
    }),
    timeout: getEnv("HEALTH_TIMEOUT", {
        type: "number",
        min: 500,
    }),
    },

    

    rateLimit: {
        limit: getEnv("RATE_LIMIT", {
            type: "number",
            min: 1,
        }),
        windowMs: getEnv("RATE_WINDOW_MS", {
            type: "number",
            min: 1,
        }),
    },

  routes: {},

  services: {},
};

export default config;