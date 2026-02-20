<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Orders</h1>

    <div v-if="orderStore.loading" class="text-center py-10">Loading...</div>

    <div v-else>
      <table class="w-full bg-white rounded shadow">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 text-left">Order ID</th>
            <th class="p-3 text-left">User</th>
            <th class="p-3 text-left">Amount (₦)</th>
            <th class="p-3 text-left">Status</th>
            <th class="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="o in paginatedOrders"
            :key="o.order_id"
            class="border-t hover:bg-gray-50"
          >
            <td class="p-3 text-sm font-mono">
              {{ o.order_id.slice(0, 8) }}...
            </td>
            <td class="p-3 text-sm">{{ o.user_name }}</td>
            <td class="p-3 text-sm font-semibold">₦{{ o.amount_naira }}</td>
            <td class="p-3 text-sm">
              <span
                :class="{
                  'bg-yellow-100 text-yellow-700': o.status === 'Pending',
                  'bg-blue-100 text-blue-700': o.status === 'ready',
                  'bg-green-100 text-green-700': o.status === 'Paid',
                }"
                class="px-2 py-1 rounded text-xs font-semibold"
              >
                {{ o.status }}
              </span>
            </td>
            <td class="p-3 text-right">
              <button
                @click="markReady(o.order_id)"
                class="text-blue-600 hover:text-blue-700 hover:underline"
              >
                Mark Ready
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Showing {{ startIndex + 1 }}-{{
            Math.min(endIndex, orderStore.orders.length)
          }}
          of {{ orderStore.orders.length }}
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
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useOrderStore } from "@/stores/order.store";

const orderStore = useOrderStore();
const currentPage = ref(1);
const itemsPerPage = 10;

onMounted(() => {
  orderStore.fetchOrders();
});

const totalPages = computed(() =>
  Math.ceil(orderStore.orders.length / itemsPerPage)
);

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => startIndex.value + itemsPerPage);

const paginatedOrders = computed(() =>
  orderStore.orders.slice(startIndex.value, endIndex.value)
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

async function markReady(orderId) {
  await orderStore.updateOrder(orderId, { status: "ready" });
}
</script>
