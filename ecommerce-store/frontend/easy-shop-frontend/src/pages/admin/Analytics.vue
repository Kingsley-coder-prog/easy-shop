<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">Analytics</h1>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <ChartBarIcon class="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Avg Order Value</p>
            <p class="text-2xl font-bold text-gray-900">₦{{ avgOrderValue }}</p>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Monthly Revenue Chart -->
      <BaseCard className="lg:col-span-1">
        <template #header>
          <div class="flex items-center gap-2">
            <ChartBarIcon class="w-5 h-5 text-blue-600" />
            <h3 class="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
          </div>
        </template>
        <div class="h-80">
          <canvas ref="revenueChartRef"></canvas>
        </div>
      </BaseCard>

      <!-- Revenue by Category (Pie Chart) -->
      <BaseCard className="lg:col-span-1">
        <template #header>
          <div class="flex items-center gap-2">
            <ChartPieIcon class="w-5 h-5 text-green-600" />
            <h3 class="text-lg font-semibold text-gray-900">
              Revenue by Category
            </h3>
          </div>
        </template>
        <div class="h-80 flex items-center justify-center">
          <canvas ref="categoryChartRef"></canvas>
        </div>
      </BaseCard>
    </div>

    <!-- Revenue Breakdown Table -->
    <BaseCard>
      <template #header>
        <div class="flex items-center gap-2">
          <DocumentChartBarIcon class="w-5 h-5 text-blue-600" />
          <h3 class="text-lg font-semibold text-gray-900">
            Revenue by Product Category
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
                Category
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
              >
                Products
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
              >
                Revenue
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
              >
                % of Total
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="cat in categoryBreakdown"
              :key="cat.category"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-3 font-medium text-gray-900">
                {{ cat.category || "Uncategorized" }}
              </td>
              <td class="px-6 py-3 text-gray-700">{{ cat.products }}</td>
              <td class="px-6 py-3 font-semibold text-gray-900">
                ₦{{ cat.revenue }}
              </td>
              <td class="px-6 py-3">
                <div class="flex items-center gap-2">
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-blue-600 h-2 rounded-full"
                      :style="{ width: cat.percentage + '%' }"
                    ></div>
                  </div>
                  <span class="text-sm font-semibold text-gray-700 min-w-[40px]"
                    >{{ cat.percentage }}%</span
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useProductStore } from "@/stores/product.store";
import { useOrderStore } from "@/stores/order.store";
import { useUserStore } from "@/stores/user.store";
import BaseCard from "@/components/common/BaseCard.vue";
import Chart from "chart.js/auto";
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ChartBarIcon,
  ChartPieIcon,
  DocumentChartBarIcon,
} from "@heroicons/vue/24/outline";

const productStore = useProductStore();
const orderStore = useOrderStore();
const userStore = useUserStore();

const revenueChartRef = ref(null);
const categoryChartRef = ref(null);
let revenueChart = null;
let categoryChart = null;

onMounted(async () => {
  await Promise.all([
    productStore.fetchProducts(),
    orderStore.fetchOrders(),
    userStore.fetchUsers(),
  ]);
  initCharts();
});

const usersCount = computed(() => userStore.users.length);
const ordersCount = computed(() => orderStore.orders.length);

const totalSales = computed(() => {
  return orderStore.orders.reduce((sum, o) => {
    return sum + (parseInt(o.amount_naira) || 0);
  }, 0);
});

const avgOrderValue = computed(() => {
  if (ordersCount.value === 0) return 0;
  return Math.round(totalSales.value / ordersCount.value);
});

const categoryBreakdown = computed(() => {
  const breakdown = {};

  orderStore.orders.forEach((order) => {
    const category = order.category || "Uncategorized";
    if (!breakdown[category]) {
      breakdown[category] = { category, revenue: 0, products: 0 };
    }
    breakdown[category].revenue += parseInt(order.amount_naira) || 0;
    breakdown[category].products += 1;
  });

  const total = totalSales.value;
  return Object.values(breakdown)
    .map((cat) => ({
      ...cat,
      percentage: total > 0 ? Math.round((cat.revenue / total) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);
});

const monthlyRevenue = computed(() => {
  const months = {};
  orderStore.orders.forEach((order) => {
    const date = new Date(order.created_at || new Date());
    const monthKey = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    if (!months[monthKey]) {
      months[monthKey] = 0;
    }
    months[monthKey] += parseInt(order.amount_naira) || 0;
  });

  const last12Months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    last12Months.push({
      month: key,
      revenue: months[key] || 0,
    });
  }
  return last12Months;
});

function initCharts() {
  // Revenue Chart
  if (revenueChartRef.value) {
    const revenueCtx = revenueChartRef.value.getContext("2d");
    if (revenueChart) revenueChart.destroy();
    revenueChart = new Chart(revenueCtx, {
      type: "line",
      data: {
        labels: monthlyRevenue.value.map((m) => m.month),
        datasets: [
          {
            label: "Revenue (₦)",
            data: monthlyRevenue.value.map((m) => m.revenue),
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: "#3b82f6",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: { font: { size: 12 } },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: (v) => "₦" + v.toLocaleString() },
          },
        },
      },
    });
  }

  // Category Pie Chart
  if (categoryChartRef.value) {
    const categoryCtx = categoryChartRef.value.getContext("2d");
    if (categoryChart) categoryChart.destroy();
    categoryChart = new Chart(categoryCtx, {
      type: "doughnut",
      data: {
        labels: categoryBreakdown.value.map((c) => c.category),
        datasets: [
          {
            data: categoryBreakdown.value.map((c) => c.revenue),
            backgroundColor: [
              "#3b82f6",
              "#10b981",
              "#f59e0b",
              "#ef4444",
              "#8b5cf6",
              "#ec4899",
              "#06b6d4",
              "#84cc16",
            ],
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { font: { size: 12 }, padding: 15 },
          },
        },
      },
    });
  }
}
</script>
