<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Users</h1>
    </div>

    <div v-if="userStore.loading" class="p-4 text-center text-gray-500">
      Loading users...
    </div>

    <div
      v-else-if="userStore.users.length === 0"
      class="p-4 text-center text-gray-500"
    >
      No users found
    </div>

    <div v-else>
      <div class="bg-white rounded shadow overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-left text-gray-500">
            <tr>
              <th class="p-3">Name</th>
              <th class="p-3">Email</th>
              <th class="p-3">Role</th>
              <th class="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="u in paginatedUsers"
              :key="u.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="p-3">{{ u.name || u.fullName || "—" }}</td>
              <td class="p-3 text-xs font-mono">{{ u.email }}</td>
              <td class="p-3">
                <span
                  :class="{
                    'bg-purple-100 text-purple-700': u.role === 'admin',
                    'bg-gray-100 text-gray-700': u.role === 'user',
                  }"
                  class="px-2 py-1 rounded text-xs font-semibold"
                >
                  {{ u.role || "user" }}
                </span>
              </td>
              <td class="p-3 text-right space-x-2">
                <button
                  @click="editUser(u)"
                  class="text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  @click="removeUser(u)"
                  class="text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Showing {{ startIndex + 1 }}-{{
            Math.min(endIndex, userStore.users.length)
          }}
          of {{ userStore.users.length }}
        </div>
        <div class="flex gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            ← Previous
          </button>
          <div class="px-3 py-2 border rounded bg-gray-50">
            Page {{ currentPage }} of {{ totalPages }}
          </div>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next →
          </button>
        </div>
      </div>
    </div>

    <UserEditModal
      v-if="editingUser"
      :user="editingUser"
      @close="editingUser = null"
      @save="saveUser"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import UserEditModal from "@/components/admin/UserEditModal.vue";

const userStore = useUserStore();
const currentPage = ref(1);
const itemsPerPage = 10;

onMounted(() => {
  userStore.fetchUsers();
});

const editingUser = ref(null);

const totalPages = computed(() =>
  Math.ceil(userStore.users.length / itemsPerPage)
);

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => startIndex.value + itemsPerPage);

const paginatedUsers = computed(() =>
  userStore.users.slice(startIndex.value, endIndex.value)
);

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const editUser = (u) => {
  editingUser.value = { ...u };
};

const saveUser = async (payload) => {
  const id =
    editingUser.value.id || editingUser.value._id || editingUser.value.user_id;
  if (!id) return alert("User id not found");
  try {
    await userStore.updateUser(id, payload);
    editingUser.value = null;
    alert("User updated");
  } catch (err) {
    console.error(err);
    alert("Failed to update user");
  }
};

const removeUser = async (u) => {
  const id = u.id || u._id || u.user_id;
  if (!id) return alert("User id not found");
  try {
    await userStore.deleteUser(id);
    alert("User deleted");
  } catch (err) {
    console.error(err);
    alert("Failed to delete user");
  }
};
</script>