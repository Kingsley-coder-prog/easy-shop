<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Orders Management</h1>

    <div v-if="orderStore.loading" class="text-center py-10">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
    </div>

    <div v-else>
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Order ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Payment Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Order Status
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="o in paginatedOrders"
              :key="o.order_id"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4 text-sm font-mono text-gray-600">
                {{ o.order_id.slice(0, 12) }}...
              </td>
              <td class="px-6 py-4 text-sm text-gray-800">
                {{ o.user_name || "—" }}
              </td>
              <td class="px-6 py-4 text-sm font-semibold text-gray-900">
                ₦{{ o.amount_naira }}
              </td>
              <td class="px-6 py-4 text-sm">
                <span
                  :class="{
                    'bg-yellow-100 text-yellow-800':
                      o.payment_status === 'pending',
                    'bg-green-100 text-green-800': o.payment_status === 'paid',
                    'bg-gray-100 text-gray-800': !['pending', 'paid'].includes(
                      o.payment_status
                    ),
                  }"
                  class="px-3 py-1 rounded-full text-xs font-semibold inline-block capitalize"
                >
                  {{ o.payment_status || "pending" }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <span
                  :class="{
                    'bg-blue-100 text-blue-800': o.order_status === 'ready',
                    'bg-purple-100 text-purple-800':
                      o.order_status === 'pending',
                    'bg-indigo-100 text-indigo-800':
                      o.order_status === 'shipped',
                    'bg-green-100 text-green-800':
                      o.order_status === 'completed',
                    'bg-gray-100 text-gray-800': ![
                      'pending',
                      'ready',
                      'shipped',
                      'completed',
                    ].includes(o.order_status),
                  }"
                  class="px-3 py-1 rounded-full text-xs font-semibold inline-block capitalize"
                >
                  {{ o.order_status || "pending" }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="markReady(o.order_id)"
                  class="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition"
                >
                  Mark Ready
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
            Math.min(endIndex, orderStore.orders.length)
          }}
          of {{ orderStore.orders.length }}
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
  await orderStore.updateOrder(orderId, { order_status: "ready" });
}
</script>
