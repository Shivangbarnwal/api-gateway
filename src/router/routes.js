import { Router } from "./router.js";
import config from "../config/config.js";

const router = new Router();

router.loadRoutes(config.routes);

export default router;