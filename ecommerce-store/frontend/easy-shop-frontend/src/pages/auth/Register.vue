<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>

    <form @submit.prevent="register" class="space-y-4">
      <input
        v-model="formData.name"
        type="text"
        placeholder="Name"
        class="w-full border p-2 rounded"
      />

      <input
        v-model="formData.email"
        type="email"
        placeholder="Email"
        class="w-full border p-2 rounded"
      />

      <input
        v-model="formData.password"
        type="password"
        placeholder="Password"
        class="w-full border p-2 rounded"
      />

      <button
        class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Register
      </button>
    </form>

    <p class="text-sm text-center mt-4">
      Already have an account?
      <router-link to="/login" class="text-blue-600"> Login </router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const formData = ref({
  name: "",
  email: "",
  password: "",
});

async function register() {
  await authStore.register(formData.value);
  router.push("/login");
}
</script>

<style>
</style>