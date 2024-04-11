import "@unocss/reset/tailwind.css";
import "./styles/index.css";
import "uno.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { setupDirective } from "./lib/directive";

const app = createApp(App);
const pinia = createPinia();

const router = createRouter({
  history: createWebHistory(),
  routes: [],
});

setupDirective(app);

app.use(router);
app.use(pinia);
app.mount("#app");
