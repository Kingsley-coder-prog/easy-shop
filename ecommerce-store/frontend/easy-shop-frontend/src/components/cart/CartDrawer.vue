<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50" @click="close"></div>

    <!-- Drawer -->
    <div
      class="relative ml-auto w-full max-w-md bg-white h-full shadow-xl p-6 flex flex-col"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">Your Cart</h2>
        <button @click="close" class="text-gray-500 hover:text-black text-2xl">
          ✕
        </button>
      </div>

      <!-- Empty -->
      <div
        v-if="items.length === 0"
        class="flex-1 flex items-center justify-center text-gray-500 text-center"
      >
        <div>
          <p class="text-2xl mb-2">🛒</p>
          <p>Cart is empty</p>
          <RouterLink
            to="/products"
            @click="close"
            class="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
          >
            Continue Shopping
          </RouterLink>
        </div>
      </div>

      <!-- Items -->
      <div v-else class="flex-1 overflow-y-auto space-y-4">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex gap-4 border-b pb-4"
        >
          <img
            :src="item.image || 'https://via.placeholder.com/80'"
            :alt="item.name"
            class="w-20 h-20 object-cover rounded"
          />

          <div class="flex-1">
            <h3 class="font-semibold text-sm">{{ item.name }}</h3>
            <p class="text-sm text-gray-500">₦{{ formatPrice(item.price) }}</p>

            <div class="flex items-center gap-2 mt-2">
              <button
                @click="updateQuantity(item.id, item.quantity - 1)"
                class="px-2 py-1 border rounded hover:bg-gray-100 transition"
              >
                −
              </button>

              <span class="px-2">{{ item.quantity }}</span>

              <button
                @click="updateQuantity(item.id, item.quantity + 1)"
                class="px-2 py-1 border rounded hover:bg-gray-100 transition"
              >
                +
              </button>

              <button
                @click="handleRemoveItem(item.id)"
                class="ml-auto text-red-500 text-sm hover:text-red-700 transition"
              >
                Remove
              </button>
            </div>

            <!-- Subtotal for item -->
            <div class="mt-2 text-right">
              <p class="text-xs text-gray-500">Subtotal</p>
              <p class="font-semibold">
                ₦{{ formatPrice(item.price * item.quantity) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="items.length" class="border-t pt-4">
        <div class="flex justify-between mb-4">
          <span class="font-semibold">Total</span>
          <span class="font-bold">₦{{ formatPrice(totalPrice) }}</span>
        </div>

        <RouterLink
          to="/cart"
          @click="close"
          class="block w-full bg-blue-600 text-white text-center py-3 rounded hover:bg-blue-700 transition font-semibold mb-2"
        >
          View Cart
        </RouterLink>

        <RouterLink
          to="/checkout"
          @click="close"
          class="block w-full bg-green-600 text-white text-center py-3 rounded hover:bg-green-700 transition font-semibold"
        >
          Checkout
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import { useCartStore } from "@/stores/cart.store";
import { useToastStore } from "@/stores/toast.store";

const cartStore = useCartStore();
const toastStore = useToastStore();
const { items, isOpen, totalPrice } = storeToRefs(cartStore);
const { close, removeItem, updateQuantity } = cartStore;

const handleRemoveItem = (id) => {
  removeItem(id);
  toastStore.info("Item removed from cart");
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
</script>
