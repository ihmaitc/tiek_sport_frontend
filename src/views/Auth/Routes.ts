import { RouteRecordRaw } from "vue-router";

export const AuthRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "auth-login",
    component: () => import("@/views/Auth/LoginForm.vue"),
    meta: {
      redirectIfLoggedIn: true
    }
  }
];
