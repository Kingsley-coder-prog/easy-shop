<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full border p-2 rounded"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full border p-2 rounded"
        />

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {{ loading ? "Login..." : "Login" }}
        </button>
      </form>
      <p v-if="error" class="text-red-500 text-sm text-center mt-2">
        {{ error }}
      </p>

      <p class="text-sm text-center mt-4">
        No account?
        <router-link to="/register" class="text-blue-600">
          Register
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");

const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
  error.value = "";
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    alert("Login successful.");
    router.push("/products");
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    error.value =
      err.response?.data?.error || err.response?.data?.msg || "Login failed";
  } finally {
    loading.value = false;
  }
};
</script>
