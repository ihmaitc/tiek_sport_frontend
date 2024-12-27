import { RouteRecordRaw } from "vue-router";
import info from "./info";
import document from "./document";
import managment from "./managment";

const MainRoutes: RouteRecordRaw = {
  path: "/main",
  component: () => import("@/app/config/layouts/FullLayout.vue"),
  children: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      name: "Dashboard",
      path: "/home",
      component: () => import("@/views/dashboard.vue")
    },
    ...info,
    ...document,
    ...managment
  ]
};

export default MainRoutes;
