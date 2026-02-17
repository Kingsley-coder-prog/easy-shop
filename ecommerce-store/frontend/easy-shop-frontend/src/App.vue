<template>
  <div>
    <!-- <h1>Welcome to Easy Shop</h1> -->
    <Navbar />
    <RouterView />
    <CartDrawer />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import CartDrawer from "@/components/cart/CartDrawer.vue";
import Navbar from "./components/Navbar.vue";
</script>

<style>
</style>