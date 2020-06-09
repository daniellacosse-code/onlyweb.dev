import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/pages/Home.vue";

Vue.use(VueRouter);

export const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/rust",
    name: "Rust",
    component: () =>
      import(/* webpackChunkName: "wasm" */ "@/pages/WebAssembly.vue"),
  },
  {
    path: "/scanner",
    name: "Barcode Scanner",
    component: () =>
      import(/* webpackChunkName: "scanner" */ "@/pages/Scanner.vue"),
  },
  {
    path: "/geo",
    name: "Geolocation",
    component: () =>
      import(/* webpackChunkName: "geo" */ "@/pages/Geolocation.vue"),
  },
  {
    path: "/push",
    name: "Push (WIP)",
    component: () => import(/* webpackChunkName: "push" */ "@/pages/Push.vue"),
  },
  {
    path: "/3d",
    name: "3D (WIP)",
    component: () => import(/* webpackChunkName: "3d" */ "@/pages/3D.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [...routes, { path: "*", redirect: "/" }],
});

export default router;
