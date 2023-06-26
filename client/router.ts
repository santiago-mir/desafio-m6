import { Router } from "@vaadin/router";
const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "login-page" },
  { path: "/home", component: "home-page" },
  { path: "/game-room", component: "game-room-page" },
  { path: "/start-game", component: "start-page" },
  { path: "/countdown", component: "countdown-page" },
  { path: "/results", component: "results-page" },
  { path: "(.*)", redirect: "/" },
]);
