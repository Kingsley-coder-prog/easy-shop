<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white p-4">
      <h2 class="text-xl font-bold mb-6">Admin Panel</h2>

      <nav class="space-y-3">
        <RouterLink to="/admin/products" class="block hover:text-blue-400">
          Products
        </RouterLink>
        <RouterLink to="/admin/orders" class="block hover:text-blue-400">
          Orders
        </RouterLink>
        <RouterLink to="/admin/users" class="block hover:text-blue-400">
          Users
        </RouterLink>
      </nav>
    </aside>

    <!-- Main -->
    <main class="flex-1 p-6">
      <RouterView />
    </main>
  </div>
</template>
