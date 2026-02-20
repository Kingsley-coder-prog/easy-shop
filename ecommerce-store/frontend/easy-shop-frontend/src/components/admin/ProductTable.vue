<template>
  <div>
    <!-- Table -->
    <table class="w-full bg-white rounded shadow">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-3 text-left">Name</th>
          <th class="p-3 text-left">Price</th>
          <th class="p-3 text-left">Stock</th>
          <th class="p-3 text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="p in paginatedProducts"
          :key="p._id || p.product_id"
          class="border-t hover:bg-gray-50"
        >
          <td class="p-3">{{ p.name }}</td>
          <td class="p-3">₦{{ p.price }}</td>
          <td class="p-3">{{ p.stock || "—" }}</td>
          <td class="p-3 text-right space-x-2">
            <button
              @click="$emit('edit', p)"
              class="text-blue-600 hover:text-blue-700"
            >
              Edit
            </button>
            <button
              @click="$emit('delete', p)"
              class="text-red-600 hover:text-red-700"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between">
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
          class="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          ← Previous
        </button>
        <div class="px-3 py-2 border rounded bg-gray-50">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
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
