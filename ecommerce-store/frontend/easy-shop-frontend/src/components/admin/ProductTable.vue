<template>
  <div>
    <!-- Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              Product
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              Price
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              Stock
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="p in paginatedProducts"
            :key="p._id || p.product_id"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-6 py-4 text-sm font-medium text-gray-900">
              {{ p.name }}
            </td>
            <td class="px-6 py-4 text-sm font-semibold text-gray-800">
              ₦{{ p.price }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ p.stock || "—" }}
            </td>
            <td class="px-6 py-4 text-right space-x-2">
              <button
                @click="$emit('edit', p)"
                class="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition"
              >
                Edit
              </button>
              <button
                @click="$emit('delete', p)"
                class="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Showing {{ startIndex + 1 }}-{{
          Math.min(endIndex, products.length)
        }}
        of {{ products.length }}
      </div>
      <div class="flex gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        >
          ← Previous
        </button>
        <div
          class="px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg text-sm font-semibold"
        >
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        >
          Next →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
  itemsPerPage: {
    type: Number,
    default: 10,
  },
});

const currentPage = ref(1);

const totalPages = computed(() =>
  Math.ceil(props.products.length / props.itemsPerPage)
);

const startIndex = computed(() => (currentPage.value - 1) * props.itemsPerPage);
const endIndex = computed(() => startIndex.value + props.itemsPerPage);

const paginatedProducts = computed(() =>
  props.products.slice(startIndex.value, endIndex.value)
);

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>
