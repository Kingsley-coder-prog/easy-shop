import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const Login = () => import("@/pages/auth/Login.vue");
const Register = () => import("@/pages/auth/Register.vue");
const Products = () => import("@/pages/products/Products.vue");
const Cart = () => import("@/pages/cart/Cart.vue");
const Checkout = () => import("@/pages/checkout/Checkout.vue");
const OrderConfirmation = () => import("@/pages/orders/OrderConfirmation.vue");
const AdminLayout = () => import("@/layouts/AdminLayout.vue");
const AdminDashboard = () => import("@/pages/admin/Dashboard.vue");
const AdminProducts = () => import("@/pages/admin/Products.vue");
const AdminOrders = () => import("@/pages/admin/Orders.vue");
const AdminUsers = () => import("@/pages/admin/Users.vue");
const AdminAnalytics = () => import("@/pages/admin/Analytics.vue");
const AdminReports = () => import("@/pages/admin/Reports.vue");
const AdminSettings = () => import("@/pages/admin/Settings.vue");

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
  {
    path: "/products",
    component: Products,
  },
  {
    path: "/cart",
    component: Cart,
    meta: { requiresAuth: true },
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
      { path: "dashboard", component: AdminDashboard },
      { path: "products", component: AdminProducts },
      { path: "orders", component: AdminOrders },
      { path: "users", component: AdminUsers },
      { path: "analytics", component: AdminAnalytics },
      { path: "reports", component: AdminReports },
      { path: "settings", component: AdminSettings },
      { path: "", redirect: "dashboard" },
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
