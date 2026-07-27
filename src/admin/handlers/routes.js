import router from "../../router/routes.js";

export function getRoutes(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");

  res.end(
    JSON.stringify(router.getSnapshot(), null, 2)
  );
}