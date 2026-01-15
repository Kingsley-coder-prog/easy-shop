import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

import { useAuthStore } from "./stores/auth.store";

const authStore = useAuthStore();

// Fetch current user if access token exists
if (authStore.accessToken) {
  authStore.fetchCurrentUser();
}

app.mount("#app");
