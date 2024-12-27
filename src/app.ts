import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import vuetify from "./app/config/plugins/vuetify";
import "@/app/styles/style.scss";
import { maska } from "maska";
import ApiService from "./services/api.service";
import Notifications from "@kyvg/vue3-notification";
import "vue-datepicker-next/index.css";
import "@/services/axios";

import i18n from "./app/config/i18n";
// @ts-ignore
import velocity from "velocity-animate";
import axios from "axios";
import loadComponents from "./componentsLoader";
import { router } from "./app/config/router";

export const buildApp = () => {
  const app = createApp(App);
  const pinia = createPinia();

  ApiService.mount401Interceptor();
  app.directive("mask", maska);
  app.use(router);
  loadComponents(app);

  axios.defaults.headers.common["lang"] = (localStorage.getItem("lang") || "uz_latn").replace("-", "_");

  app.use(pinia);
  app.use(Notifications, { velocity });
  app.use(vuetify);
  app.use(i18n);

  return { router, app, i18n, pinia };
};
