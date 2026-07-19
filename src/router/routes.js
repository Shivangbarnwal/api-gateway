import { Router } from "./router.js";

const router = new Router();

router.register("/users", "users");
router.register("/products", "products");
router.register("/payments", "payments");

export default router;