import { createApp } from "vue";
import App from "./App.vue";
import { clerkPlugin } from "vue-clerk/plugin";
import "@unocss/reset/tailwind.css";
import "./styles/index.css";
import "uno.css";
const app = createApp(App);

app.use(clerkPlugin, {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
});

app.mount("#app");
