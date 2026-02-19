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
          Create your account
        </h2>

        <form @submit.prevent="register" class="space-y-4">
          <div>
            <label class="text-sm text-gray-600">Full name</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full border p-2 rounded mt-1"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label class="text-sm text-gray-600">Email</label>
            <input
              v-model="formData.email"
              type="email"
              required
              class="w-full border p-2 rounded mt-1"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label class="text-sm text-gray-600">Password</label>
            <input
              v-model="formData.password"
              type="password"
              required
              class="w-full border p-2 rounded mt-1"
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? "Creating account..." : "Create account" }}
          </button>
        </form>

        <p v-if="error" class="text-red-500 text-sm text-center mt-3">
          {{ error }}
        </p>

        <p class="text-sm text-center mt-4 text-gray-600">
          Already registered?
          <router-link to="/login" class="text-blue-600 font-medium"
            >Sign in</router-link
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

const formData = ref({
  name: "",
  email: "",
  password: "",
});

const loading = ref(false);
const error = ref("");

async function register() {
  error.value = "";
  loading.value = true;

  try {
    console.log("API URL:", import.meta.env.VITE_EASYSHOP_BASE_URL);
    console.log("Payload:", formData.value);
    await authStore.register(formData.value);

    toastStore.success("Registration successful! Redirecting to login...");
    router.push("/login");
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    const errorMsg =
      err.response?.data?.error ||
      err.response?.data?.msg ||
      "Registration failed";
    error.value = errorMsg;
    toastStore.error(errorMsg);
  } finally {
    loading.value = false;
  }
}
</script>

<style>
</style>

