import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

import Login from "@/pages/auth/Login.vue";
import Register from "@/pages/auth/Register.vue";
import Products from "@/pages/products/Products.vue";
import Checkout from "@/pages/checkout/Checkout.vue";
import OrderConfirmation from "@/pages/orders/OrderConfirmation.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import AdminProducts from "@/pages/admin/Products.vue";
import AdminOrders from "@/pages/admin/Orders.vue";
import AdminUsers from "@/pages/admin/Users.vue";

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
  {
    path: "/checkout",
    component: Checkout,
    meta: { requiresAuth: true },
  },
  {
    path: "/order-success",
    component: OrderConfirmation,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: "products", component: AdminProducts },
      { path: "orders", component: AdminOrders },
      { path: "users", component: AdminUsers },
    ],
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
