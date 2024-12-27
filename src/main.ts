import { buildApp } from "./app";

const { app, pinia, } = buildApp();
// @ts-ignore
const storeInitialState = window.INITIAL_DATA;
if (storeInitialState) {
  pinia.state.value = storeInitialState;
}

app.mount("#app");
