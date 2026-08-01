import { createBackend } from "./createBackend.js";

const port = Number(process.env.PORT);
const serviceName = process.env.SERVICE_NAME;
const instanceId = process.env.INSTANCE_ID;

if (Number.isNaN(port) || !serviceName || !instanceId) {
  throw new Error(
    "PORT, SERVICE_NAME and INSTANCE_ID environment variables are required."
  );
}

createBackend(
  port,
  serviceName,
  instanceId
);