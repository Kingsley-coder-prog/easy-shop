<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Products</h1>
        <p class="text-gray-600">Browse our collection of products</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          ></div>
          <p class="text-gray-500 mt-4">Loading products...</p>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
      >
        <p class="text-red-700 font-semibold mb-2">⚠️ Error loading products</p>
        <p class="text-red-600 text-sm">{{ error }}</p>
        <button
          @click="retry"
          class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!loading && products.length === 0"
        class="text-center py-12"
      >
        <div class="text-6xl mb-4">📭</div>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">
          No products available
        </h2>
        <p class="text-gray-500">Check back soon for new products!</p>
      </div>

      <!-- Products Grid -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <ProductCard
          v-for="product in products"
          :key="product.product_id || product.id"
          :product="product"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import ProductCard from "./ProductCard.vue";
import { useProductStore } from "@/stores/product.store";
import { useCartStore } from "@/stores/cart.store";
import { useToastStore } from "@/stores/toast.store";

const productStore = useProductStore();
const cartStore = useCartStore();
const toastStore = useToastStore();
const { products, loading, error } = storeToRefs(productStore);

onMounted(async () => {
  await loadProducts();
});

const loadProducts = async () => {
  console.log("🚀 ProductList: Fetching products...");
  try {
    await productStore.fetchProducts();
    console.log("✅ ProductList: Products loaded successfully", {
      count: products.value?.length,
      products: products.value,
    });
  } catch (err) {
    console.error("❌ ProductList: Error fetching products", err);
  }
};

const handleAddToCart = (product) => {
  console.log("➕ ProductList: Adding to cart", product);
  cartStore.addItem(product);
  toastStore.success(`${product.name} added to cart!`);
};

const retry = () => {
  loadProducts();
};
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
