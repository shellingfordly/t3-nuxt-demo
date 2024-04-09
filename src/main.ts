import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { clerkPlugin } from "vue-clerk/plugin";

const app = createApp(App);

app.use(clerkPlugin, {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
});

app.mount("#app");
