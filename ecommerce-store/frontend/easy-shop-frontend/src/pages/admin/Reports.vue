<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Reports</h1>
      <button
        @click="exportToCSV"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center gap-2"
      >
        <ArrowDownTrayIcon class="w-5 h-5" />
        Export CSV
      </button>
    </div>

    <!-- Sales Summary -->
    <BaseCard>
      <template #header>
        <div class="flex items-center gap-2">
          <CurrencyDollarIcon class="w-5 h-5 text-blue-600" />
          <h3 class="text-lg font-semibold text-gray-900">Sales Summary</h3>
        </div>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="border-l-4 border-blue-600 pl-4 py-2">
          <p class="text-sm text-gray-600">Total Sales</p>
          <p class="text-2xl font-bold text-gray-900">₦{{ totalSales }}</p>
        </div>
        <div class="border-l-4 border-green-600 pl-4 py-2">
          <p class="text-sm text-gray-600">Paid Orders</p>
          <p class="text-2xl font-bold text-gray-900">{{ paidOrders }}</p>
        </div>
        <div class="border-l-4 border-yellow-600 pl-4 py-2">
          <p class="text-sm text-gray-600">Pending Orders</p>
          <p class="text-2xl font-bold text-gray-900">{{ pendingOrders }}</p>
        </div>
        <div class="border-l-4 border-purple-600 pl-4 py-2">
          <p class="text-sm text-gray-600">Ready Orders</p>
          <p class="text-2xl font-bold text-gray-900">{{ readyOrders }}</p>
        </div>
      </div>
    </BaseCard>

    <!-- Top Products -->
    <BaseCard>
      <template #header>
        <div class="flex items-center gap-2">
          <ShoppingBagIcon class="w-5 h-5 text-green-600" />
          <h3 class="text-lg font-semibold text-gray-900">
            Top Selling Products
          </h3>
        </div>
      </template>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
              >
                Product Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
              >
                Price
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
              >
                Times Ordered
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
              >
                Estimated Revenue
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="(product, idx) in topProducts"
              :key="idx"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-3 font-medium text-gray-900">
                {{ product.name }}
              </td>
              <td class="px-6 py-3 text-gray-700">₦{{ product.price }}</td>
              <td class="px-6 py-3 text-gray-700">{{ product.orders }}</td>
              <td class="px-6 py-3 font-semibold text-gray-900">
                ₦{{ product.revenue }}
              </td>
            </tr>
            <tr v-if="topProducts.length === 0" class="hover:bg-gray-50">
              <td colspan="4" class="px-6 py-3 text-center text-gray-500">
                No sales data available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- Recent Orders -->
    <BaseCard>
      <template #header>
        <div class="flex items-center gap-2">
          <DocumentChartBarIcon class="w-5 h-5 text-orange-600" />
          <h3 class="text-lg font-semibold text-gray-900">Recent Orders</h3>
        </div>
      </template>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
              >
                Order ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
              >
                Customer
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
              >
                Amount
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
              >
                Date
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="order in recentOrders"
              :key="order.order_id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-3 font-mono text-xs text-gray-600">
                {{ order.order_id.slice(0, 10) }}...
              </td>
              <td class="px-6 py-3 text-gray-900">{{ order.user_name }}</td>
              <td class="px-6 py-3 font-semibold text-gray-900">
                ₦{{ order.amount_naira }}
              </td>
              <td class="px-6 py-3">
                <span
                  :class="{
                    'bg-green-100 text-green-800': order.status === 'Paid',
                    'bg-yellow-100 text-yellow-800': order.status === 'Pending',
                    'bg-blue-100 text-blue-800': order.status === 'ready',
                  }"
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-3 text-gray-600">
                {{ formatDate(order.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- Customer Statistics -->
    <BaseCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UserGroupIcon class="w-5 h-5 text-purple-600" />
          <h3 class="text-lg font-semibold text-gray-900">
            Customer Statistics
          </h3>
        </div>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
          <p class="text-sm text-gray-600">Total Customers</p>
          <p class="text-3xl font-bold text-blue-600">{{ totalCustomers }}</p>
        </div>
        <div
          class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg"
        >
          <p class="text-sm text-gray-600">Active Users</p>
          <p class="text-3xl font-bold text-green-600">{{ activeUsers }}</p>
        </div>
        <div
          class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg"
        >
          <p class="text-sm text-gray-600">Avg Orders per Customer</p>
          <p class="text-3xl font-bold text-purple-600">
            {{ avgOrdersPerCustomer }}
          </p>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useProductStore } from "@/stores/product.store";
import { useOrderStore } from "@/stores/order.store";
import { useUserStore } from "@/stores/user.store";
import BaseCard from "@/components/common/BaseCard.vue";
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  DocumentChartBarIcon,
  ArrowDownTrayIcon,
} from "@heroicons/vue/24/outline";

const productStore = useProductStore();
const orderStore = useOrderStore();
const userStore = useUserStore();

onMounted(async () => {
  await Promise.all([
    productStore.fetchProducts(),
    orderStore.fetchOrders(),
    userStore.fetchUsers(),
  ]);
});

const totalSales = computed(() => {
  return orderStore.orders.reduce((sum, o) => {
    return sum + (parseInt(o.amount_naira) || 0);
  }, 0);
});

const paidOrders = computed(() => {
  return orderStore.orders.filter((o) => o.status === "Paid").length;
});

const pendingOrders = computed(() => {
  return orderStore.orders.filter((o) => o.status === "Pending").length;
});

const readyOrders = computed(() => {
  return orderStore.orders.filter((o) => o.status === "ready").length;
});

const topProducts = computed(() => {
  const productSales = {};

  orderStore.orders.forEach((order) => {
    const product = productStore.products.find(
      (p) => p.product_id === order.product_id || p._id === order.product_id
    );
    if (product) {
      if (!productSales[product._id || product.product_id]) {
        productSales[product._id || product.product_id] = {
          name: product.name,
          price: product.price,
          orders: 0,
          revenue: 0,
        };
      }
      productSales[product._id || product.product_id].orders += 1;
      productSales[product._id || product.product_id].revenue +=
        parseInt(order.amount_naira) || 0;
    }
  });

  return Object.values(productSales)
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 10);
});

const recentOrders = computed(() => {
  return orderStore.orders
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);
});

const totalCustomers = computed(() => userStore.users.length);

const activeUsers = computed(() => {
  return userStore.users.filter((u) => u.active !== false).length;
});

const avgOrdersPerCustomer = computed(() => {
  if (totalCustomers.value === 0) return 0;
  return (orderStore.orders.length / totalCustomers.value).toFixed(2);
});

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function exportToCSV() {
  const headers = ["Order ID", "Customer", "Amount (₦)", "Status", "Date"];
  const rows = recentOrders.value.map((o) => [
    o.order_id,
    o.user_name,
    o.amount_naira,
    o.status,
    formatDate(o.created_at),
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reports-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
}
</script>
