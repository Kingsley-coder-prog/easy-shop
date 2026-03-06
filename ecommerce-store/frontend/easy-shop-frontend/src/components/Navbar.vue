<template>
  <nav
    class="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50"
  >
    <RouterLink to="/products" class="font-bold text-xl"> EasyShop </RouterLink>

    <div class="flex items-center gap-4">
      <!-- Normal users - hide on login/register pages -->
      <RouterLink v-if="!isAuthPage" to="/products">Products</RouterLink>
      <RouterLink v-if="!isAuthPage" to="/cart">Cart</RouterLink>

      <!-- 🔐 ADMIN ONLY -->
      <RouterLink
        v-if="authStore.isAdmin"
        to="/admin/products"
        class="text-red-600 font-medium"
      >
        Admin
      </RouterLink>

      <!-- Auth -->
      <button
        v-if="authStore.isAuthenticated"
        @click="logout"
        class="text-gray-600"
      >
        Logout
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore();
const route = useRoute();

const isAuthPage = computed(() => {
  return route.path === "/login" || route.path === "/register";
});

const logout = () => {
  authStore.logout();
};
</script>
