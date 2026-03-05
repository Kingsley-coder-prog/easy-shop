<template>
  <div class="flex flex-col min-h-screen">
    <!-- <h1>Welcome to Easy Shop</h1> -->
    <Navbar />
    <main class="flex-grow">
      <RouterView />
    </main>
    <Footer />
    <CartDrawer />
    <Toast
      :message="toastStore.message"
      :type="toastStore.type"
      :isVisible="toastStore.isVisible"
    />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import CartDrawer from "@/components/cart/CartDrawer.vue";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/common/Footer.vue";
import Toast from "./components/common/Toast.vue";
import { useToastStore } from "@/stores/toast.store";

const toastStore = useToastStore();
</script>

<style>
</style>