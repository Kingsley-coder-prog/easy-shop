<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
        <div class="flex items-center gap-4">
          <div class="bg-blue-100 p-3 rounded-lg">
            <ShoppingBagIcon class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div class="text-sm text-gray-500">Total Products</div>
            <div class="text-3xl font-bold">{{ productsCount }}</div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
        <div class="flex items-center gap-4">
          <div class="bg-green-100 p-3 rounded-lg">
            <ShoppingCartIcon class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div class="text-sm text-gray-500">Total Orders</div>
            <div class="text-3xl font-bold">{{ ordersCount }}</div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
        <div class="flex items-center gap-4">
          <div class="bg-purple-100 p-3 rounded-lg">
            <UserGroupIcon class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div class="text-sm text-gray-500">Total Users</div>
            <div class="text-3xl font-bold">{{ usersCount }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center gap-2 mb-4">
          <TrendingUpIcon class="w-5 h-5 text-blue-600" />
          <h3 class="text-lg font-semibold text-gray-700">
            Orders (last 7 days)
          </h3>
        </div>
        <div class="h-40 flex items-end gap-2">
          <div v-for="(d, i) in ordersByDay" :key="i" class="flex-1">
            <div class="h-full flex items-end">
              <div
                :style="{
                  height:
                    d.count === 0 ? '6px' : (d.count / maxOrders) * 100 + '%',
                }"
                class="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition"
              ></div>
            </div>
            <div class="text-xs text-center text-gray-500 mt-2">
              {{ d.label }}
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center gap-2 mb-4">
          <CurrencyDollarIcon class="w-5 h-5 text-green-600" />
          <h3 class="text-lg font-semibold text-gray-700">
            Sales (₦) - last 7 days
          </h3>
        </div>
        <div class="h-40 flex items-end gap-2">
          <div v-for="(d, i) in salesByDay" :key="i" class="flex-1">
            <div class="h-full flex items-end">
              <div
                :style="{ height: (d.total / maxSales) * 100 + '%' }"
                class="w-full bg-green-500 rounded-t hover:bg-green-600 transition"
              ></div>
            </div>
            <div class="text-xs text-center text-gray-500 mt-2">
              {{ d.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex items-center gap-2 mb-4">
        <DocumentTextIcon class="w-5 h-5 text-gray-600" />
        <h2 class="text-lg font-semibold">Recent Orders</h2>
      </div>
      <div v-if="orderStore.loading" class="text-center py-6">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        ></div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr class="text-left text-gray-600 font-semibold">
              <th class="px-4 py-3">Order ID</th>
              <th class="px-4 py-3">Customer</th>
              <th class="px-4 py-3">Amount</th>
              <th class="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="o in recentOrders"
              :key="o.order_id"
              class="border-t hover:bg-gray-50 transition"
            >
              <td class="px-4 py-3 font-mono text-xs text-gray-600">
                {{ o.order_id }}
              </td>
              <td class="px-4 py-3">
                {{ o.user_name || o.customer_name || "—" }}
              </td>
              <td class="px-4 py-3 font-semibold">₦{{ o.amount_naira }}</td>
              <td class="px-4 py-3">
                <span
                  :class="{
                    'bg-green-100 text-green-700': o.status === 'completed',
                    'bg-yellow-100 text-yellow-700': o.status === 'pending',
                    'bg-red-100 text-red-700': o.status === 'failed',
                  }"
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {{ o.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useProductStore } from "@/stores/product.store";
import { useOrderStore } from "@/stores/order.store";
import { useUserStore } from "@/stores/user.store";
import {
  ShoppingBagIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  TrendingUpIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
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

const productsCount = computed(() => productStore.products?.length || 0);
const ordersCount = computed(() => orderStore.orders?.length || 0);
const usersCount = computed(() => userStore.users?.length || 0);

const recentOrders = computed(() => (orderStore.orders || []).slice(0, 8));

// Helpers for charts - last 7 days
function formatLabel(date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const getLastNDates = (n) => {
  const arr = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d);
  }
  return arr;
};

const dates7 = getLastNDates(7);

const ordersByDay = computed(() => {
  const orders = orderStore.orders || [];
  const data = dates7.map((d) => {
    const day = d.toISOString().slice(0, 10);
    const list = orders.filter(
      (o) => (o.created_at || o.date || "").slice(0, 10) === day
    );
    return { label: formatLabel(d), count: list.length };
  });
  return data;
});

const salesByDay = computed(() => {
  const orders = orderStore.orders || [];
  const data = dates7.map((d) => {
    const day = d.toISOString().slice(0, 10);
    const list = orders.filter(
      (o) => (o.created_at || o.date || "").slice(0, 10) === day
    );
    const total = list.reduce(
      (s, it) => s + Number(it.amount_naira || it.amount || 0),
      0
    );
    return { label: formatLabel(d), total };
  });
  return data;
});

const maxOrders = computed(() =>
  Math.max(1, ...ordersByDay.value.map((d) => d.count))
);
const maxSales = computed(() =>
  Math.max(1, ...salesByDay.value.map((d) => d.total))
);
</script>
