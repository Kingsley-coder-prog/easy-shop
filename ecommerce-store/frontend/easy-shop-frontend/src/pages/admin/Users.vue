<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Users Management</h1>

    <div v-if="userStore.loading" class="text-center py-10">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
    </div>

    <div v-else-if="userStore.users.length === 0" class="text-center py-10">
      <p class="text-gray-500">No users found</p>
    </div>

    <div v-else>
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="u in paginatedUsers"
              :key="u.id"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                {{ u.name || u.fullName || "—" }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ u.email }}</td>
              <td class="px-6 py-4 text-sm">
                <span
                  :class="{
                    'bg-purple-100 text-purple-800': u.role === 'admin',
                    'bg-gray-100 text-gray-800': u.role === 'user' || !u.role,
                  }"
                  class="px-3 py-1 rounded-full text-xs font-semibold inline-block"
                >
                  {{ u.role || "user" }}
                </span>
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <button
                  @click="editUser(u)"
                  class="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>
                <button
                  @click="removeUser(u)"
                  class="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
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
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            ← Previous
          </button>
          <div
            class="px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg text-sm font-semibold"
          >
            Page {{ currentPage }} of {{ totalPages }}
          </div>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
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
    alert("User updated successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to update user");
  }
};

const removeUser = async (u) => {
  const id = u.id || u._id || u.user_id;
  if (!id) return alert("User id not found");
  if (!confirm("Are you sure you want to delete this user?")) return;
  try {
    await userStore.deleteUser(id);
    alert("User deleted successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to delete user");
  }
};
</script>