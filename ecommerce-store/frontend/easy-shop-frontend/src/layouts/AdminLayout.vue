<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- Mobile Drawer & Backdrop -->
    <div
      v-if="isSidebarOpen"
      class="mobile-backdrop"
      @click="toggleSidebar"
    ></div>
    <aside v-if="isSidebarOpen" class="mobile-drawer p-6 md:hidden">
      <div class="mb-6">
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
      <nav class="space-y-4 text-sm">
        <RouterLink
          to="/admin/products"
          class="block py-2 px-3 rounded hover:bg-gray-800"
          >Products</RouterLink
        >
        <RouterLink
          to="/admin/orders"
          class="block py-2 px-3 rounded hover:bg-gray-800"
          >Orders</RouterLink
        >
        <RouterLink
          to="/admin/users"
          class="block py-2 px-3 rounded hover:bg-gray-800"
          >Users</RouterLink
        >
      </nav>
    </aside>
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white p-6 hidden md:block">
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

      <nav class="space-y-4 text-sm">
        <RouterLink
          to="/admin/products"
          class="block py-2 px-3 rounded hover:bg-gray-800"
        >
          Products
        </RouterLink>
        <RouterLink
          to="/admin/orders"
          class="block py-2 px-3 rounded hover:bg-gray-800"
        >
          Orders
        </RouterLink>
        <RouterLink
          to="/admin/users"
          class="block py-2 px-3 rounded hover:bg-gray-800"
        >
          Users
        </RouterLink>
      </nav>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col">
      <!-- Topbar -->
      <header
        class="bg-white shadow px-6 py-3 flex items-center justify-between"
      >
        <div class="flex items-center gap-4">
          <button @click="toggleSidebar" class="md:hidden text-gray-700">
            ☰
          </button>
          <h1 class="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
          <div class="ml-6 text-sm text-gray-500">
            Manage products, orders and users
          </div>
        </div>

        <div class="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search products, orders..."
            class="hidden md:inline-block border rounded px-3 py-1 text-sm w-72"
          />

          <div class="flex items-center gap-3">
            <div class="text-sm text-gray-600">Admin</div>
            <div
              class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center"
            >
              A
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isSidebarOpen = ref(false);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}
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
}

.mobile-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 50;
}
</style>
