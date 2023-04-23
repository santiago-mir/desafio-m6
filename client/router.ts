import { Router } from "@vaadin/router";
const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "login-page" },
  { path: "/home", component: "home-page" },
  { path: "/game-room", component: "game-room-page" },
  { path: "(.*)", redirect: "/" },
]);
