<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Your Orders</h1>
          <p class="text-sm text-gray-600">
            Track your order history and status.
          </p>
        </div>
        <RouterLink
          to="/products"
          class="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Continue Shopping
        </RouterLink>
      </div>

      <div v-if="orderStore.loading" class="py-12 text-center">
        <Loader size="lg" label="Loading orders" />
        <p class="text-gray-600 mt-3">Loading your orders...</p>
      </div>

      <div
        v-else-if="sortedOrders.length === 0"
        class="bg-white rounded-lg shadow p-10 text-center"
      >
        <h2 class="text-xl font-semibold text-gray-800 mb-2">No orders yet</h2>
        <p class="text-gray-500 mb-6">
          Your completed checkouts will appear here.
        </p>
        <RouterLink
          to="/products"
          class="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Start Shopping
        </RouterLink>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="order in sortedOrders"
          :key="order.order_id"
          class="bg-white rounded-lg shadow p-5"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4 mb-4"
          >
            <div>
              <p class="text-sm text-gray-500">Order ID</p>
              <p class="font-mono text-sm font-semibold text-gray-900">
                {{ order.order_id }}
              </p>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <span
                class="px-2 py-1 rounded bg-green-100 text-green-700 font-medium"
              >
                {{ (order.payment_status || "pending").toUpperCase() }}
              </span>
              <span
                class="px-2 py-1 rounded bg-blue-100 text-blue-700 font-medium"
              >
                {{ (order.order_status || "pending").toUpperCase() }}
              </span>
              <span class="font-semibold text-gray-900">
                ₦{{ formatAmount(order.amount_naira) }}
              </span>
            </div>
          </div>

          <div class="space-y-2">
            <div
              v-for="(item, idx) in parseItems(order.items_json)"
              :key="`${order.order_id}-${idx}`"
              class="flex items-center justify-between text-sm"
            >
              <p class="text-gray-700">{{ item.name }} × {{ item.quantity }}</p>
              <p class="font-medium text-gray-900">
                ₦{{ formatAmount((item.price || 0) * (item.quantity || 0)) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useOrderStore } from "@/stores/order.store";
import Loader from "@/components/common/Loader.vue";

const orderStore = useOrderStore();

onMounted(async () => {
  await orderStore.fetchMyOrders();
});

const sortedOrders = computed(() => {
  const orders = [...(orderStore.myOrders || [])];
  return orders.sort((a, b) => {
    const aDate = new Date(a.created_at || a.updated_at || 0).getTime();
    const bDate = new Date(b.created_at || b.updated_at || 0).getTime();
    return bDate - aDate;
  });
});

const parseItems = (itemsJson) => {
  if (!itemsJson) return [];
  if (Array.isArray(itemsJson)) return itemsJson;

  try {
    const parsed = JSON.parse(itemsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const formatAmount = (value) => Number(value || 0).toLocaleString();
</script>
