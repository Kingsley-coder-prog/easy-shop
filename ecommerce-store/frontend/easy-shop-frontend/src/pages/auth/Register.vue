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
        type="submit"
        :disabled="loading"
        class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
      >
        {{ loading ? "Registering..." : "Register" }}
      </button>
    </form>

    <p v-if="error" class="text-red-500 text-sm text-center mt-2">
      {{ error }}
    </p>

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

const loading = ref(false);
const error = ref("");

async function register() {
  error.value = "";

  try {
    console.log("API URL:", import.meta.env.VITE_EASYSHOP_BASE_URL);
    console.log("Payload:", formData.value);
    loading.value = true;
    await authStore.register(formData.value);

    alert("Registration successful. Please login.");
    router.push("/login");
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    error.value =
      err.response?.data?.error ||
      err.response?.data?.msg ||
      "Registration failed";
  } finally {
    loading.value = false;
  }
}
</script>

<style>
</style>

