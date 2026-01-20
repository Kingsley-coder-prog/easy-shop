<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Orders</h1>

    <div v-if="orderStore.loading" class="text-center py-10">Loading...</div>

    <table v-else class="w-full bg-white rounded shadow">
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
        <tr v-for="o in orderStore.orders" :key="o.order_id" class="border-t">
          <td class="p-3 text-sm">{{ o.order_id }}</td>
          <td class="p-3 text-sm">{{ o.user_name }}</td>
          <td class="p-3 text-sm">{{ o.amount_naira }}</td>
          <td class="p-3 text-sm">{{ o.status }}</td>
          <td class="p-3 text-right">
            <button
              @click="markReady(o.order_id)"
              class="text-blue-600 hover:underline"
            >
              Mark Ready
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useOrderStore } from "@/stores/order.store";

const orderStore = useOrderStore();

onMounted(() => {
  orderStore.fetchOrders();
});

async function markReady(orderId) {
  await orderStore.updateOrder(orderId, { status: "ready" });
}
</script>
