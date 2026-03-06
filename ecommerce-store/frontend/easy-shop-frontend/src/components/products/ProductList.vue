<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Search Bar -->
      <div class="mb-6">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for products, categories..."
            class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="handleSearch"
          />
          <svg
            class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar - Categories -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-4 sticky top-4">
            <h3 class="font-bold text-gray-900 mb-4 uppercase text-sm">
              Categories
            </h3>
            <div class="space-y-2">
              <button
                @click="selectedCategory = null"
                :class="{
                  'bg-blue-50 text-blue-600 font-semibold':
                    selectedCategory === null,
                  'text-gray-700 hover:bg-gray-50': selectedCategory !== null,
                }"
                class="w-full text-left px-3 py-2 rounded-md transition text-sm"
              >
                All Products
              </button>
              <button
                v-for="category in categories"
                :key="category"
                @click="selectedCategory = category"
                :class="{
                  'bg-blue-50 text-blue-600 font-semibold':
                    selectedCategory === category,
                  'text-gray-700 hover:bg-gray-50':
                    selectedCategory !== category,
                }"
                class="w-full text-left px-3 py-2 rounded-md transition text-sm capitalize"
              >
                {{ category }}
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="lg:col-span-3">
          <!-- Image Carousel / Banner -->
          <div class="mb-6 bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="relative h-64">
              <transition name="fade">
                <img
                  :key="currentSlide"
                  :src="carouselImages[currentSlide]"
                  :alt="`Slide ${currentSlide + 1}`"
                  class="w-full h-full object-cover"
                />
              </transition>
              <!-- Carousel Indicators -->
              <div
                class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2"
              >
                <button
                  v-for="(img, idx) in carouselImages"
                  :key="idx"
                  @click="currentSlide = idx"
                  :class="{
                    'bg-white': currentSlide === idx,
                    'bg-white/50': currentSlide !== idx,
                  }"
                  class="w-2 h-2 rounded-full transition"
                ></button>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12">
            <div
              class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
            ></div>
            <p class="text-gray-500 mt-4">Loading products...</p>
          </div>

          <!-- Products Sections -->
          <div v-else-if="filteredProducts.length > 0">
            <!-- All Products / Filtered Results -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 class="text-xl font-bold text-blue-400 mb-4">
                {{
                  selectedCategory
                    ? `${selectedCategory} Products`
                    : searchQuery
                    ? "Search Results"
                    : "All Products"
                }}
              </h2>
              <div
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                <ProductCard
                  v-for="product in filteredProducts"
                  :key="product.product_id || product.id"
                  :product="product"
                  :compact="true"
                  @add-to-cart="handleAddToCart"
                />
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white rounded-lg shadow-sm p-12 text-center">
            <div class="text-6xl mb-4">📭</div>
            <h2 class="text-2xl font-semibold text-gray-700 mb-2">
              No products found
            </h2>
            <p class="text-gray-500">Try adjusting your search or filters</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import ProductCard from "./ProductCard.vue";
import { useProductStore } from "@/stores/product.store";
import { useCartStore } from "@/stores/cart.store";
import { useToastStore } from "@/stores/toast.store";

const productStore = useProductStore();
const cartStore = useCartStore();
const toastStore = useToastStore();
const { products, loading } = storeToRefs(productStore);

const searchQuery = ref("");
const selectedCategory = ref(null);
const currentSlide = ref(0);

// Carousel images - using placeholder images
const carouselImages = ref([
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop",
]);

let carouselInterval;

onMounted(async () => {
  await productStore.fetchProducts();
  startCarousel();
});

onUnmounted(() => {
  stopCarousel();
});

const startCarousel = () => {
  carouselInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % carouselImages.value.length;
  }, 4000);
};

const stopCarousel = () => {
  if (carouselInterval) {
    clearInterval(carouselInterval);
  }
};

const categories = computed(() => {
  const cats = new Set(products.value.map((p) => p.category).filter(Boolean));
  return Array.from(cats).sort();
});

const filteredProducts = computed(() => {
  let filtered = products.value;

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter((p) => p.category === selectedCategory.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const handleAddToCart = (product) => {
  cartStore.addItem(product);
  toastStore.success(`${product.name} added to cart!`);
};

const handleSearch = () => {
  // Reset category when searching
  if (searchQuery.value) {
    selectedCategory.value = null;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
