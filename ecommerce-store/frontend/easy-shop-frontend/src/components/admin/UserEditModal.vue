<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-md p-6 rounded-lg">
      <h3 class="text-lg font-semibold mb-4">Edit User</h3>

      <form @submit.prevent="submit" class="space-y-3">
        <div>
          <label class="text-sm text-gray-600">Name</label>
          <input v-model="form.name" class="input w-full mt-1" />
        </div>

        <div>
          <label class="text-sm text-gray-600">Email</label>
          <input v-model="form.email" type="email" class="input w-full mt-1" />
        </div>

        <div>
          <label class="text-sm text-gray-600">Role</label>
          <select v-model="form.role" class="input w-full mt-1">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div class="flex justify-end gap-2">
          <button type="button" @click="$emit('close')" class="px-3 py-2">
            Cancel
          </button>
          <button
            type="submit"
            class="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({ user: Object });
const emit = defineEmits(["save", "close"]);

const form = reactive({ name: "", email: "", role: "user" });

watch(
  () => props.user,
  (u) => {
    if (u) {
      form.name = u.name || u.fullName || "";
      form.email = u.email || "";
      form.role = u.role || "user";
    }
  },
  { immediate: true }
);

function submit() {
  emit("save", { ...form });
}
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #e5e7eb;
  padding: 8px;
  border-radius: 6px;
}
</style>
