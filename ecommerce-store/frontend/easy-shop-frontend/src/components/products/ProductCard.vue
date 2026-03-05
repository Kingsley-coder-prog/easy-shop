<template>
  <div
    :class="[
      'bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden h-full flex flex-col',
      { 'text-sm': compact },
    ]"
  >
    <!-- Image Container -->
    <div
      :class="[
        'relative w-full bg-gray-200 overflow-hidden',
        compact ? 'h-32' : 'h-48',
      ]"
    >
      <img
        :src="product.image || fallbackImage"
        :alt="product.name"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        @error="handleImageError"
      />
      <div
        v-if="imageError"
        class="absolute inset-0 flex items-center justify-center bg-gray-300"
      >
        <span class="text-gray-500 text-xs">Image not available</span>
      </div>
    </div>

    <!-- Content -->
    <div :class="['flex flex-col flex-grow', compact ? 'p-2' : 'p-4']">
      <!-- Product Name -->
      <h2
        :class="[
          'font-semibold mb-1 line-clamp-2',
          compact ? 'text-xs' : 'text-lg',
        ]"
      >
        {{ product.name }}
      </h2>

      <!-- Description (hide in compact mode) -->
      <p
        v-if="!compact"
        class="text-gray-500 text-sm mb-3 line-clamp-2 flex-grow"
      >
        {{ product.description }}
      </p>

      <!-- Category Badge -->
      <div :class="compact ? 'mb-1' : 'mb-3'">
        <span
          :class="[
            'inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded',
            compact ? 'text-[10px]' : 'text-xs',
          ]"
        >
          {{ product.category }}
        </span>
      </div>

      <!-- Price -->
      <div class="mt-auto">
        <span
          :class="[
            'text-blue-600 font-bold block mb-2',
            compact ? 'text-sm' : 'text-lg',
          ]"
        >
          ₦{{ formatPrice(product.price_naira) }}
        </span>

        <!-- Compact Mode: Simple Add Button -->
        <button
          v-if="compact"
          @click="handleQuickAdd"
          class="w-full bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition text-xs"
        >
          Add to Cart
        </button>

        <!-- Full Mode: Quantity Selector -->
        <div v-else class="flex items-center gap-2">
          <div class="flex items-center border rounded">
            <button
              @click="decrementQuantity"
              class="px-3 py-1 hover:bg-gray-100 transition text-gray-600"
              :disabled="quantity <= 1"
            >
              −
            </button>
            <input
              v-model.number="quantity"
              type="number"
              min="1"
              class="w-12 text-center border-x py-1 focus:outline-none"
              @input="validateQuantity"
            />
            <button
              @click="incrementQuantity"
              class="px-3 py-1 hover:bg-gray-100 transition text-gray-600"
            >
              +
            </button>
          </div>

          <button
            @click="handleAddToCart"
            class="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition cursor-pointer text-sm font-medium"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      name: "",
      description: "",
      price_naira: 0,
      image: "",
      category: "",
    }),
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["add-to-cart"]);

const imageError = ref(false);
const quantity = ref(1);
const fallbackImage = "https://via.placeholder.com/300x300?text=No+Image";

const handleImageError = () => {
  imageError.value = true;
};

const incrementQuantity = () => {
  quantity.value++;
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const validateQuantity = (event) => {
  const value = parseInt(event.target.value);
  if (isNaN(value) || value < 1) {
    quantity.value = 1;
  } else {
    quantity.value = value;
  }
};

const handleQuickAdd = () => {
  // Quick add with quantity of 1 for compact cards
  const productWithQuantity = {
    ...props.product,
    quantity: 1,
  };
  emit("add-to-cart", productWithQuantity);
};

const handleAddToCart = () => {
  // Create a copy of the product with the selected quantity
  const productWithQuantity = {
    ...props.product,
    quantity: quantity.value,
  };
  emit("add-to-cart", productWithQuantity);
  // Reset quantity after adding
  quantity.value = 1;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};
</script>

<style scoped>
/* Smooth transitions */
img {
  transition: transform 0.3s ease;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
