<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600 mt-2">
        Welcome back! Here's your business overview
      </p>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <BaseCard>
        <div class="flex items-center gap-4">
          <div class="bg-blue-100 p-3 rounded-lg">
            <CurrencyDollarIcon class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Sales</p>
            <p class="text-2xl font-bold text-gray-900">₦{{ totalSales }}</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <div class="flex items-center gap-4">
          <div class="bg-green-100 p-3 rounded-lg">
            <ShoppingCartIcon class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Orders</p>
            <p class="text-2xl font-bold text-gray-900">{{ ordersCount }}</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <div class="flex items-center gap-4">
          <div class="bg-purple-100 p-3 rounded-lg">
            <UserGroupIcon class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Customers</p>
            <p class="text-2xl font-bold text-gray-900">{{ usersCount }}</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <div class="flex items-center gap-4">
          <div class="bg-yellow-100 p-3 rounded-lg">
            <ShoppingBagIcon class="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Products</p>
            <p class="text-2xl font-bold text-gray-900">{{ productsCount }}</p>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BaseCard>
        <template #header>
          <div class="flex items-center gap-2">
            <ChartBarIcon class="w-5 h-5 text-blue-600" />
            <h3 class="text-lg font-semibold text-gray-900">
              Orders (Last 7 Days)
            </h3>
          </div>
        </template>
        <div class="h-40 flex items-end gap-2">
          <div v-for="(d, i) in ordersByDay" :key="i" class="flex-1">
            <div class="h-full flex items-end">
              <div
                :style="{
                  height:
                    d.count === 0 ? '6px' : (d.count / maxOrders) * 100 + '%',
                }"
                class="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition cursor-pointer"
                :title="`${d.label}: ${d.count} orders`"
              ></div>
            </div>
            <div class="text-xs text-center text-gray-600 mt-2 font-semibold">
              {{ d.label }}
            </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <template #header>
          <div class="flex items-center gap-2">
            <CurrencyDollarIcon class="w-5 h-5 text-green-600" />
            <h3 class="text-lg font-semibold text-gray-900">
              Sales (₦) - Last 7 Days
            </h3>
          </div>
        </template>
        <div class="h-40 flex items-end gap-2">
          <div v-for="(d, i) in salesByDay" :key="i" class="flex-1">
            <div class="h-full flex items-end">
              <div
                :style="{ height: (d.total / maxSales) * 100 + '%' }"
                class="w-full bg-green-500 rounded-t hover:bg-green-600 transition cursor-pointer"
                :title="`${d.label}: ₦${d.total}`"
              ></div>
            </div>
            <div class="text-xs text-center text-gray-600 mt-2 font-semibold">
              {{ d.label }}
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Recent Orders Table -->
    <BaseCard>
      <template #header>
        <div class="flex items-center gap-2">
          <ClipboardDocumentListIcon class="w-5 h-5 text-blue-600" />
          <h3 class="text-lg font-semibold text-gray-900">Recent Orders</h3>
        </div>
      </template>
      <div v-if="orderStore.loading" class="text-center py-10">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        ></div>
      </div>

      <div v-else-if="recentOrders.length === 0" class="text-center py-10">
        <p class="text-gray-500">No orders yet</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr class="text-left text-gray-700 font-semibold">
              <th class="px-6 py-3 text-xs uppercase">Order ID</th>
              <th class="px-6 py-3 text-xs uppercase">Customer</th>
              <th class="px-6 py-3 text-xs uppercase">Amount</th>
              <th class="px-6 py-3 text-xs uppercase">Payment Status</th>
              <th class="px-6 py-3 text-xs uppercase">Order Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="o in recentOrders"
              :key="o.order_id"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4 font-mono text-xs text-gray-600">
                {{ o.order_id.slice(0, 12) }}...
              </td>
              <td class="px-6 py-4 text-gray-900">
                {{ o.user_name || o.customer_name || "—" }}
              </td>
              <td class="px-6 py-4 font-semibold text-gray-900">
                ₦{{ o.amount_naira }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="{
                    'bg-yellow-100 text-yellow-800':
                      o.payment_status === 'pending',
                    'bg-green-100 text-green-800': o.payment_status === 'paid',
                    'bg-gray-100 text-gray-800': !['pending', 'paid'].includes(
                      o.payment_status
                    ),
                  }"
                  class="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                >
                  {{ o.payment_status || "pending" }}
                </span>
              </td>
              <td class="px-6 py-4">
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
                  class="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                >
                  {{ o.order_status || "pending" }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useProductStore } from "@/stores/product.store";
import { useOrderStore } from "@/stores/order.store";
import { useUserStore } from "@/stores/user.store";
import BaseCard from "@/components/common/BaseCard.vue";
import {
  ShoppingBagIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
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

const totalSales = computed(() => {
  return (orderStore.orders || []).reduce((sum, o) => {
    return sum + (parseInt(o.amount_naira) || 0);
  }, 0);
});

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
