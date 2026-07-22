import envConfig from "./env.js";
import gatewayConfig from "./gateway.js";

const config = {
  ...envConfig,
  ...gatewayConfig,
};

export default Object.freeze(config);