<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div class="w-full max-w-lg">
      <div class="bg-white p-10 rounded-lg shadow-lg w-full">
        <div class="flex items-center justify-center mb-6">
          <div
            class="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg"
          >
            ES
          </div>
        </div>
        <h2 class="text-2xl font-semibold mb-4 text-center">
          Sign in to your account
        </h2>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="text-sm text-gray-600">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              class="w-full border p-2 rounded mt-1"
              required
            />
          </div>

          <div>
            <label class="text-sm text-gray-600">Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="Your password"
              class="w-full border p-2 rounded mt-1"
              required
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? "Signing in..." : "Sign in" }}
          </button>
        </form>

        <p v-if="error" class="text-red-500 text-sm text-center mt-3">
          {{ error }}
        </p>

        <p class="text-sm text-center mt-4 text-gray-600">
          Don't have an account?
          <router-link to="/register" class="text-blue-600 font-medium">
            Create one</router-link
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useToastStore } from "@/stores/toast.store";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const toastStore = useToastStore();
const router = useRouter();

const email = ref("");
const password = ref("");

const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
  error.value = "";
  loading.value = true;
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    toastStore.success("Login successful!");
    router.push("/products");
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    const errorMsg =
      err.response?.data?.error || err.response?.data?.msg || "Login failed";
    error.value = errorMsg;
    toastStore.error(errorMsg);
  } finally {
    loading.value = false;
  }
};
</script>
