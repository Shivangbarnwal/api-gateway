import router from "./router/routes.js";

console.log(router.match("/users"));
console.log(router.match("/users/1"));
console.log(router.match("/payments/order"));
console.log(router.match("/abc"));