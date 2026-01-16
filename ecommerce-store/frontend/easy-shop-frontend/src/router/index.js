import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

import Login from "@/pages/auth/Login.vue";
import Register from "@/pages/auth/Register.vue";
import Products from "@/pages/products/Products.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
  // {
  //   path: "/admin",
  //   component: AdminDashboard,
  //   meta: { requiresAdmin: true },
  // },
  {
    path: "/products",
    component: Products,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  /**
   * 1️⃣ Public routes
   */
  if (to.path === "/login" || to.path === "/register") {
    return next();
  }

  /**
   * 2️⃣ Restore user on refresh if token exists
   */
  if (authStore.accessToken && !authStore.user) {
    try {
      await authStore.fetchCurrentUser();
    } catch {
      return next("/login");
    }
  }

  /**
   * 3️⃣ Requires authentication
   */
  if (!authStore.isAuthenticated) {
    return next("/login");
  }

  /**
   * 4️⃣ Requires admin role
   */
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next("/products");
  }

  /**
   * 5️⃣ Allow navigation
   */
  next();
});

export default router;
