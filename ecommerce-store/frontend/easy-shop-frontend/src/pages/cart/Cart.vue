<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-6">
      <div class="flex items-center gap-2 mb-8">
        <ShoppingCartIcon class="w-8 h-8 text-blue-600" />
        <h1 class="text-3xl font-bold text-gray-800">Shopping Cart</h1>
      </div>

      <!-- Empty State -->
      <div v-if="items.length === 0" class="text-center py-16">
        <div class="bg-white rounded-lg shadow p-8">
          <ShoppingBagIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 class="text-2xl font-semibold text-gray-700 mb-2">
            Your cart is empty
          </h2>
          <p class="text-gray-500 mb-6">Add some products to get started!</p>
          <RouterLink
            to="/products"
            class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Continue Shopping
          </RouterLink>
        </div>
      </div>

      <!-- Cart Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Items List -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b">
              <h2 class="text-lg font-semibold text-gray-800">
                Items ({{ items.length }})
              </h2>
            </div>

            <div class="divide-y">
              <div
                v-for="item in items"
                :key="item.id"
                class="p-6 flex gap-6 hover:bg-gray-50 transition"
              >
                <!-- Product Image -->
                <div class="flex-shrink-0">
                  <img
                    :src="item.image || 'https://via.placeholder.com/120'"
                    :alt="item.name"
                    class="w-24 h-24 object-cover rounded-lg"
                  />
                </div>

                <!-- Product Info -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-semibold text-gray-800 mb-2">
                    {{ item.name }}
                  </h3>
                  <p class="text-2xl font-bold text-blue-600 mb-4">
                    ₦{{ formatPrice(item.price) }}
                  </p>

                  <!-- Quantity Controls -->
                  <div class="flex items-center gap-3">
                    <span class="text-sm text-gray-600">Quantity:</span>
                    <div class="flex items-center border rounded-lg">
                      <button
                        @click="updateQuantity(item.id, item.quantity - 1)"
                        class="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                      >
                        −
                      </button>
                      <span class="px-4 py-1 font-semibold">
                        {{ item.quantity }}
                      </span>
                      <button
                        @click="updateQuantity(item.id, item.quantity + 1)"
                        class="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>

                    <!-- Subtotal -->
                    <div class="ml-auto text-right">
                      <p class="text-sm text-gray-500 mb-1">Subtotal</p>
                      <p class="text-lg font-bold text-gray-800">
                        ₦{{ formatPrice(item.price * item.quantity) }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Remove Button -->
                <div class="flex-shrink-0">
                  <button
                    @click="removeItem(item.id)"
                    class="text-red-500 hover:text-red-700 transition p-2"
                    title="Remove item"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Clear Cart -->
          <div class="mt-4 text-right">
            <button
              @click="clearCart"
              class="text-red-600 hover:text-red-700 transition font-medium text-sm"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6 sticky top-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">
              Order Summary
            </h3>

            <!-- Breakdown -->
            <div class="space-y-3 mb-6 pb-6 border-b">
              <div class="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₦{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span class="text-green-600 font-semibold">Free</span>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <span>Tax (0%)</span>
                <span>₦0</span>
              </div>
            </div>

            <!-- Total -->
            <div class="flex justify-between items-center mb-6">
              <span class="text-lg font-semibold text-gray-800">Total</span>
              <span class="text-3xl font-bold text-blue-600">
                ₦{{ formatPrice(totalPrice) }}
              </span>
            </div>

            <!-- Checkout Button -->
            <RouterLink
              to="/checkout"
              class="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition font-semibold mb-3"
            >
              Proceed to Checkout
            </RouterLink>

            <!-- Continue Shopping -->
            <RouterLink
              to="/products"
              class="block w-full border border-gray-300 text-gray-700 text-center py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Continue Shopping
            </RouterLink>

            <!-- Info -->
            <div class="mt-6 pt-6 border-t text-xs text-gray-500 space-y-2">
              <p class="flex items-center gap-2">
                <CheckIcon class="w-4 h-4 text-green-600" />
                Secure checkout
              </p>
              <p class="flex items-center gap-2">
                <CheckIcon class="w-4 h-4 text-green-600" />
                Free returns (30 days)
              </p>
              <p class="flex items-center gap-2">
                <CheckIcon class="w-4 h-4 text-green-600" />
                Fast delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCartStore } from "@/stores/cart.store";
import {
  ShoppingCartIcon,
  ShoppingBagIcon,
  TrashIcon,
  CheckIcon,
} from "@heroicons/vue/24/outline";

const cartStore = useCartStore();
const { items, totalPrice } = storeToRefs(cartStore);
const { removeItem, updateQuantity, clear: clearCart } = cartStore;

const subtotal = computed(() => totalPrice.value);

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
</script>
