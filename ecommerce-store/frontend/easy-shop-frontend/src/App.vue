<template>
  <div class="flex flex-col min-h-screen">
    <!-- <h1>Welcome to Easy Shop</h1> -->
    <Navbar />
    <main class="grow">
      <RouterView />
    </main>
    <!-- Footer - hidden on admin pages (AdminLayout has its own Footer) -->
    <Footer v-if="!isAdminPage" />
    <CartDrawer />
    <Toast
      :message="toastStore.message"
      :type="toastStore.type"
      :isVisible="toastStore.isVisible"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { RouterView } from "vue-router";
import { useRoute } from "vue-router";
import CartDrawer from "@/components/cart/CartDrawer.vue";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/common/Footer.vue";
import Toast from "./components/common/Toast.vue";
import { useToastStore } from "@/stores/toast.store";

const toastStore = useToastStore();
const route = useRoute();

const isAdminPage = computed(() => {
  return route.path.startsWith("/admin");
});
</script>

<style>
</style>