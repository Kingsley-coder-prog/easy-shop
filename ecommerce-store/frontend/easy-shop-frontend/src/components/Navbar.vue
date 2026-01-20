<template>
  <nav class="bg-white shadow px-6 py-4 flex justify-between items-center">
    <RouterLink to="/products" class="font-bold text-xl"> EasyShop </RouterLink>

    <div class="flex items-center gap-4">
      <!-- Normal users -->
      <RouterLink to="/products">Products</RouterLink>
      <RouterLink to="/cart">Cart</RouterLink>

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
import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
};
</script>
