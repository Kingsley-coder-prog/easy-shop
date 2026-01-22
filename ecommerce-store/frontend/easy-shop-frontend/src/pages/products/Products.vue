<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Products</h1>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-10">
        <p class="text-gray-500">Loading products...</p>
      </div>

      <!-- Error -->
      <div v-if="error" class="text-center py-10 text-red-500">
        {{ error }}
      </div>

      <!-- Empty -->
      <div
        v-if="!loading && products.length === 0"
        class="text-center py-10 text-gray-500"
      >
        No products available
      </div>

      <!-- Products Grid -->
      <div
        v-if="!loading && products.length"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white rounded-lg shadow hover:shadow-lg transition"
        >
          <img
            :src="product.image || 'https://via.placeholder.com/300'"
            alt="product image"
            class="w-full h-48 object-cover rounded-t-lg"
          />

          <div class="p-4">
            <h2 class="font-semibold text-lg mb-1">
              {{ product.name }}
            </h2>

            <p class="text-gray-500 text-sm mb-3 line-clamp-2">
              {{ product.description }}
            </p>

            <div class="flex items-center justify-between">
              <span class="text-blue-600 font-bold">
                ₦{{ product.price }}
              </span>

              <button
                @click="addToCart(product)"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useProductStore } from "@/stores/product.store";
import { useCartStore } from "@/stores/cart.store";

const productsStore = useProductStore();
const cartStore = useCartStore();
const { products, loading, error } = storeToRefs(productsStore);

onMounted(() => {
  productsStore.fetchProducts();
});

function addToCart(product) {
  cartStore.addItem(product);
}
</script>



