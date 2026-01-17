<template>
  <div>
    <!-- <h1>Welcome to Easy Shop</h1> -->
    <RouterView />
    <CartDrawer />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import CartDrawer from "@/components/cart/CartDrawer.vue";
</script>

<style>
</style>