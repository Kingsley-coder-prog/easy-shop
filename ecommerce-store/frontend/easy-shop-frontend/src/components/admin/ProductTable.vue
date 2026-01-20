<template>
  <table class="w-full bg-white rounded shadow">
    <thead class="bg-gray-100">
      <tr>
        <th class="p-3 text-left">Name</th>
        <th class="p-3 text-left">Price</th>
        <th class="p-3 text-left">Stock</th>
        <th class="p-3 text-right">Actions</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="p in products" :key="p._id" class="border-t">
        <td class="p-3">{{ p.name }}</td>
        <td class="p-3">₦{{ p.price }}</td>
        <td class="p-3">{{ p.stock }}</td>
        <td class="p-3 text-right space-x-2">
          <button @click="$emit('edit', p)" class="text-blue-600">Edit</button>
          <button @click="$emit('delete', p._id)" class="text-red-600">
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  products: Array,
});
</script>
