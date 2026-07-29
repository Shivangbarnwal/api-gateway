import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { validateGatewayConfig } from "./validator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const raw = fs.readFileSync(path.join(__dirname,  "gateway.yaml"), "utf8");
const parsed = YAML.parse(raw);

validateGatewayConfig(parsed);


export default parsed;