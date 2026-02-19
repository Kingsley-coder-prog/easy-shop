<template>
  <div>
    <!-- <h1>Welcome to Easy Shop</h1> -->
    <Navbar />
    <RouterView />
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
import Toast from "./components/common/Toast.vue";
import { useToastStore } from "@/stores/toast.store";

const toastStore = useToastStore();
</script>

<style>
</style>