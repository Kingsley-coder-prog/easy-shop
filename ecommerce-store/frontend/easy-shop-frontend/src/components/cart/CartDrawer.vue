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
        <button @click="close" class="text-gray-500 hover:text-black">✕</button>
      </div>

      <!-- Empty -->
      <div
        v-if="items.length === 0"
        class="flex-1 flex items-center justify-center text-gray-500"
      >
        Cart is empty
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
            class="w-20 h-20 object-cover rounded"
          />

          <div class="flex-1">
            <h3 class="font-semibold">{{ item.name }}</h3>
            <p class="text-sm text-gray-500">₦{{ item.price }}</p>

            <div class="flex items-center gap-2 mt-2">
              <button
                @click="updateQuantity(item.id, item.quantity - 1)"
                class="px-2 border rounded"
              >
                -
              </button>

              <span>{{ item.quantity }}</span>

              <button
                @click="updateQuantity(item.id, item.quantity + 1)"
                class="px-2 border rounded"
              >
                +
              </button>

              <button
                @click="removeItem(item.id)"
                class="ml-auto text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="items.length" class="border-t pt-4">
        <div class="flex justify-between mb-4">
          <span class="font-semibold">Total</span>
          <span class="font-bold">₦{{ totalPrice }}</span>
        </div>

        <button
          class="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCartStore } from "@/stores/cart.store";

const cartStore = useCartStore();
const { items, isOpen, totalPrice } = storeToRefs(cartStore);
const { close, removeItem, updateQuantity } = cartStore;
</script>
