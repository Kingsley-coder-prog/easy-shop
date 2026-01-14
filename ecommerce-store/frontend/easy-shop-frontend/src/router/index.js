import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

import Login from "@/pages/auth/Login.vue";
import Register from "@/pages/auth/Register.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (
    !authStore.isAuthenticated &&
    to.path !== "/login" &&
    to.path !== "/register"
  ) {
    next("/login");
  } else {
    next();
  }
});

export default router;
