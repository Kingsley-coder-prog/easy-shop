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
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <ShoppingBagIcon class="w-5 h-5 text-green-600" />
            <h3 class="text-lg font-semibold text-gray-900">
              Top Selling Products
            </h3>
          </div>
          <!-- Pagination Controls for Top Products -->
          <div
            v-if="paginatedTopProducts.length > 0"
            class="flex items-center gap-2"
          >
            <span class="text-sm text-gray-600">
              {{ topProductsPage }} / {{ topProductsTotalPages }}
            </span>
            <button
              @click="prevTopProductsPage"
              :disabled="topProductsPage === 1"
              :class="{
                'opacity-50 cursor-not-allowed': topProductsPage === 1,
                'hover:bg-gray-200': topProductsPage !== 1,
              }"
              class="p-2 rounded-lg transition"
              title="Previous page"
            >
              <svg
                class="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              @click="nextTopProductsPage"
              :disabled="topProductsPage === topProductsTotalPages"
              :class="{
                'opacity-50 cursor-not-allowed':
                  topProductsPage === topProductsTotalPages,
                'hover:bg-gray-200': topProductsPage !== topProductsTotalPages,
              }"
              class="p-2 rounded-lg transition"
              title="Next page"
            >
              <svg
                class="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
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
              v-for="(product, idx) in paginatedTopProducts"
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
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <DocumentChartBarIcon class="w-5 h-5 text-orange-600" />
            <h3 class="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <!-- Pagination Controls for Recent Orders -->
          <div
            v-if="paginatedRecentOrders.length > 0"
            class="flex items-center gap-2"
          >
            <span class="text-sm text-gray-600">
              {{ recentOrdersPage }} / {{ recentOrdersTotalPages }}
            </span>
            <button
              @click="prevRecentOrdersPage"
              :disabled="recentOrdersPage === 1"
              :class="{
                'opacity-50 cursor-not-allowed': recentOrdersPage === 1,
                'hover:bg-gray-200': recentOrdersPage !== 1,
              }"
              class="p-2 rounded-lg transition"
              title="Previous page"
            >
              <svg
                class="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              @click="nextRecentOrdersPage"
              :disabled="recentOrdersPage === recentOrdersTotalPages"
              :class="{
                'opacity-50 cursor-not-allowed':
                  recentOrdersPage === recentOrdersTotalPages,
                'hover:bg-gray-200':
                  recentOrdersPage !== recentOrdersTotalPages,
              }"
              class="p-2 rounded-lg transition"
              title="Next page"
            >
              <svg
                class="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
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
              v-for="order in paginatedRecentOrders"
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
                    'bg-green-100 text-green-800':
                      order.payment_status === 'paid',
                    'bg-yellow-100 text-yellow-800':
                      order.payment_status === 'pending',
                    'bg-blue-100 text-blue-800': order.order_status === 'ready',
                  }"
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {{ order.payment_status || order.status }}
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
import { onMounted, computed, ref } from "vue";
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

// Pagination state
const topProductsPage = ref(1);
const topProductsPerPage = 10;
const recentOrdersPage = ref(1);
const recentOrdersPerPage = 10;

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
  return orderStore.orders.filter((o) => o.payment_status === "paid").length;
});

const pendingOrders = computed(() => {
  return orderStore.orders.filter((o) => o.payment_status === "pending").length;
});

const readyOrders = computed(() => {
  return orderStore.orders.filter((o) => o.order_status === "ready").length;
});

const topProducts = computed(() => {
  const productSales = {};

  orderStore.orders.forEach((order) => {
    // Only count paid orders for top products
    if (order.payment_status !== "paid") return;

    // items_json might be string or array
    let items = order.items_json || [];
    if (typeof items === "string") {
      try {
        items = JSON.parse(items);
      } catch (e) {
        items = [];
      }
    }

    if (!Array.isArray(items)) return;

    items.forEach((item) => {
      const productId = item.product_id || item.id || item._id;
      const productName = item.name || item.product_name;
      const productPrice = parseFloat(item.price || item.price_naira || 0);
      const quantity = parseInt(item.quantity || 1);

      if (productName && productPrice) {
        if (!productSales[productId || productName]) {
          productSales[productId || productName] = {
            name: productName,
            price: productPrice,
            orders: 0,
            revenue: 0,
          };
        }
        productSales[productId || productName].orders += quantity;
        productSales[productId || productName].revenue +=
          productPrice * quantity;
      }
    });
  });

  return Object.values(productSales).sort((a, b) => b.orders - a.orders);
});

// Pagination for Top Products
const topProductsTotalPages = computed(() =>
  Math.ceil(topProducts.value.length / topProductsPerPage)
);

const paginatedTopProducts = computed(() => {
  const start = (topProductsPage.value - 1) * topProductsPerPage;
  const end = start + topProductsPerPage;
  return topProducts.value.slice(start, end);
});

const nextTopProductsPage = () => {
  if (topProductsPage.value < topProductsTotalPages.value) {
    topProductsPage.value++;
  }
};

const prevTopProductsPage = () => {
  if (topProductsPage.value > 1) {
    topProductsPage.value--;
  }
};

const recentOrders = computed(() => {
  return orderStore.orders.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
});

// Pagination for Recent Orders
const recentOrdersTotalPages = computed(() =>
  Math.ceil(recentOrders.value.length / recentOrdersPerPage)
);

const paginatedRecentOrders = computed(() => {
  const start = (recentOrdersPage.value - 1) * recentOrdersPerPage;
  const end = start + recentOrdersPerPage;
  return recentOrders.value.slice(start, end);
});

const nextRecentOrdersPage = () => {
  if (recentOrdersPage.value < recentOrdersTotalPages.value) {
    recentOrdersPage.value++;
  }
};

const prevRecentOrdersPage = () => {
  if (recentOrdersPage.value > 1) {
    recentOrdersPage.value--;
  }
};

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
  const headers = [
    "Order ID",
    "Customer",
    "Amount (₦)",
    "Payment Status",
    "Date",
  ];
  const rows = recentOrders.value.map((o) => [
    o.order_id,
    o.user_name,
    o.amount_naira,
    o.payment_status || o.status,
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
