import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/pages/Home.vue";

Vue.use(VueRouter);

export const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/scanner",
    name: "Scanner",
    component: () =>
      import(/* webpackChunkName: "scanner" */ "@/pages/Scanner.vue")
  },
  {
    path: "/3d",
    name: "3D",
    component: () => import(/* webpackChunkName: "3d" */ "@/pages/3D.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
