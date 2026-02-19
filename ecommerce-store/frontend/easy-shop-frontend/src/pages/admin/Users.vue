<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Users</h1>
    </div>

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
          <tr v-for="u in userStore.users" :key="u.id" class="border-t">
            <td class="p-3">{{ u.name || u.fullName || "—" }}</td>
            <td class="p-3">{{ u.email }}</td>
            <td class="p-3">{{ u.role || "user" }}</td>
            <td class="p-3 text-right">
              <button @click="editUser(u)" class="text-blue-600 mr-3">
                Edit
              </button>
              <button @click="removeUser(u)" class="text-red-600">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="userStore.loading" class="p-4 text-center text-gray-500">
        Loading users...
      </div>
      <div
        v-if="!userStore.loading && userStore.users.length === 0"
        class="p-4 text-center text-gray-500"
      >
        No users found
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
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user.store";
import UserEditModal from "@/components/admin/UserEditModal.vue";

const userStore = useUserStore();

onMounted(() => {
  userStore.fetchUsers();
});

const editingUser = ref(null);

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

<style scoped>
</style>