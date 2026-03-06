<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <!-- Mobile Drawer & Backdrop -->
    <div
      v-if="isSidebarOpen"
      class="mobile-backdrop"
      @click="toggleSidebar"
    ></div>
    <aside v-if="isSidebarOpen" class="mobile-drawer p-6 md:hidden">
      <div class="mb-8">
        <div class="flex items-center gap-3">
          <div
            class="bg-white text-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold"
          >
            ES
          </div>
          <div>
            <h2 class="text-lg font-semibold">EasyShop Admin</h2>
            <p class="text-sm text-gray-400">Management Console</p>
          </div>
        </div>
      </div>
      <nav class="space-y-2 text-sm">
        <RouterLink
          to="/admin/dashboard"
          class="flex items-center gap-3 py-2 px-3 rounded transition"
          :class="
            isActive('/admin/dashboard')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          "
        >
          <SquaresPlusIcon class="w-5 h-5" />
          <span>Dashboard</span>
        </RouterLink>
        <RouterLink
          to="/admin/products"
          class="flex items-center gap-3 py-2 px-3 rounded transition"
          :class="
            isActive('/admin/products')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          "
        >
          <ShoppingBagIcon class="w-5 h-5" />
          <span>Products</span>
        </RouterLink>
        <RouterLink
          to="/admin/orders"
          class="flex items-center gap-3 py-2 px-3 rounded transition"
          :class="
            isActive('/admin/orders')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          "
        >
          <ClipboardDocumentListIcon class="w-5 h-5" />
          <span>Orders</span>
        </RouterLink>
        <RouterLink
          to="/admin/users"
          class="flex items-center gap-3 py-2 px-3 rounded transition"
          :class="
            isActive('/admin/users')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          "
        >
          <UsersIcon class="w-5 h-5" />
          <span>Users</span>
        </RouterLink>
        <hr class="my-3 border-gray-700" />
        <RouterLink
          to="/admin/analytics"
          class="flex items-center gap-3 py-2 px-3 rounded transition"
          :class="
            isActive('/admin/analytics')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          "
        >
          <ChartBarIcon class="w-5 h-5" />
          <span>Analytics</span>
        </RouterLink>
        <RouterLink
          to="/admin/reports"
          class="flex items-center gap-3 py-2 px-3 rounded transition"
          :class="
            isActive('/admin/reports')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          "
        >
          <DocumentChartBarIcon class="w-5 h-5" />
          <span>Reports</span>
        </RouterLink>
        <RouterLink
          to="/admin/settings"
          class="flex items-center gap-3 py-2 px-3 rounded transition"
          :class="
            isActive('/admin/settings')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          "
        >
          <Cog6ToothIcon class="w-5 h-5" />
          <span>Settings</span>
        </RouterLink>
      </nav>
    </aside>

    <!-- Sidebar -->
    <aside
      class="w-64 bg-gray-900 text-white p-6 hidden md:block fixed h-screen overflow-y-auto"
    >
      <div class="mb-8">
        <div class="flex items-center gap-3">
          <div
            class="bg-white text-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold"
          >
            ES
          </div>
          <div>
            <h2 class="text-lg font-semibold">EasyShop Admin</h2>
            <p class="text-sm text-gray-400">Management Console</p>
          </div>
        </div>
      </div>

      <nav class="space-y-2 text-sm">
        <RouterLink
          to="/admin/dashboard"
          class="flex items-center gap-3 py-2 px-3 rounded transition"
          :class="
            isActive('/admin/dashboard')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          "
        >
          <SquaresPlusIcon class="w-5 h-5" />
          <span>Dashboard</span>
        </RouterLink>
        <RouterLink
          to="/admin/products"
          class="flex items-center gap-3 py-2 px-3 rounded transition"
          :class="
            isActive('/admin/products')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          "
        >
          <ShoppingBagIcon class="w-5 h-5" />
          <span>Products</span>
        </RouterLink>
        <RouterLink
          to="/admin/orders"
          class="flex items-center gap-3 py-2 px-3 rounded transition"
          :class="
            isActive('/admin/orders')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          "
        >
          <ClipboardDocumentListIcon class="w-5 h-5" />
          <span>Orders</span>
        </RouterLink>
        <RouterLink
          to="/admin/users"
          class="flex items-center gap-3 py-2 px-3 rounded transition"
          :class="
            isActive('/admin/users')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          "
        >
          <UsersIcon class="w-5 h-5" />
          <span>Users</span>
        </RouterLink>

        <hr class="my-3 border-gray-700" />

        <RouterLink
          to="/admin/analytics"
          class="flex items-center gap-3 py-2 px-3 rounded transition"
          :class="
            isActive('/admin/analytics')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          "
        >
          <ChartBarIcon class="w-5 h-5" />
          <span>Analytics</span>
        </RouterLink>
        <RouterLink
          to="/admin/reports"
          class="flex items-center gap-3 py-2 px-3 rounded transition"
          :class="
            isActive('/admin/reports')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          "
        >
          <DocumentChartBarIcon class="w-5 h-5" />
          <span>Reports</span>
        </RouterLink>
        <RouterLink
          to="/admin/settings"
          class="flex items-center gap-3 py-2 px-3 rounded transition"
          :class="
            isActive('/admin/settings')
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          "
        >
          <Cog6ToothIcon class="w-5 h-5" />
          <span>Settings</span>
        </RouterLink>
      </nav>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col md:ml-64">
      <!-- Topbar -->
      <header
        class="bg-white shadow px-6 py-4 flex items-center justify-between sticky top-0 z-40"
      >
        <div class="flex items-center gap-4">
          <button @click="toggleSidebar" class="md:hidden text-gray-700">
            <Bars3Icon class="w-6 h-6" />
          </button>
          <h1 class="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
        </div>

        <div class="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search products, orders..."
            class="hidden md:inline-block border border-gray-300 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div class="flex items-center gap-3">
            <div class="text-sm text-gray-600">Admin</div>
            <div
              class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold"
            >
              A
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 p-6 overflow-auto bg-gray-100">
        <RouterView />
      </main>

      <!-- Footer positioned at bottom -->
      <Footer class="mt-auto" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import Footer from "@/components/common/Footer.vue";
import {
  SquaresPlusIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
} from "@heroicons/vue/24/outline";

const isSidebarOpen = ref(false);
const route = useRoute();

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path);
};
</script>

<style scoped>
/* Mobile drawer overlay */
.mobile-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 16rem; /* 64 */
  background: #0f172a; /* gray-900 */
  color: white;
  z-index: 60;
  overflow-y: auto;
}

.mobile-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 50;
}
</style>

<style scoped>
/* Mobile drawer overlay */
.mobile-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 16rem; /* 64 */
  background: #0f172a; /* gray-900 */
  color: white;
  z-index: 60;
}

.mobile-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 50;
}
</style>
