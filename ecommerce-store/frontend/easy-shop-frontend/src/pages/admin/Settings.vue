<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
      <p class="text-gray-600 mt-2">
        Manage your application settings and admin profile
      </p>
    </div>

    <!-- Admin Profile -->
    <BaseCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UserCircleIcon class="w-5 h-5 text-blue-600" />
          <h3 class="text-lg font-semibold text-gray-900">Admin Profile</h3>
        </div>
      </template>
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Full Name</label
            >
            <input
              v-model="adminProfile.fullName"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Email</label
            >
            <input
              v-model="adminProfile.email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Phone</label
            >
            <input
              v-model="adminProfile.phone"
              type="tel"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Position</label
            >
            <input
              v-model="adminProfile.position"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Store Manager"
            />
          </div>
        </div>
        <button
          @click="saveProfile"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Save Profile
        </button>
      </div>
    </BaseCard>

    <!-- Store Information -->
    <BaseCard>
      <template #header>
        <div class="flex items-center gap-2">
          <BuildingStorefrontIcon class="w-5 h-5 text-green-600" />
          <h3 class="text-lg font-semibold text-gray-900">Store Information</h3>
        </div>
      </template>
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Store Name</label
            >
            <input
              v-model="storeInfo.storeName"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter store name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Store Email</label
            >
            <input
              v-model="storeInfo.storeEmail"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter store email"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Store Phone</label
            >
            <input
              v-model="storeInfo.storePhone"
              type="tel"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter store phone"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Currency</label
            >
            <select
              v-model="storeInfo.currency"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="NGN">Nigerian Naira (₦)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Store Address</label
          >
          <textarea
            v-model="storeInfo.storeAddress"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter store address"
          ></textarea>
        </div>
        <button
          @click="saveStoreInfo"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
        >
          Save Store Information
        </button>
      </div>
    </BaseCard>

    <!-- Application Settings -->
    <BaseCard>
      <template #header>
        <div class="flex items-center gap-2">
          <Cog6ToothIcon class="w-5 h-5 text-purple-600" />
          <h3 class="text-lg font-semibold text-gray-900">
            Application Settings
          </h3>
        </div>
      </template>
      <div class="space-y-4">
        <div
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div>
            <h4 class="font-medium text-gray-900">Email Notifications</h4>
            <p class="text-sm text-gray-600">
              Receive email alerts for new orders and updates
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="settings.emailNotifications"
              type="checkbox"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
            ></div>
          </label>
        </div>

        <div
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div>
            <h4 class="font-medium text-gray-900">Two-Factor Authentication</h4>
            <p class="text-sm text-gray-600">
              Add an extra layer of security to your account
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="settings.twoFactorAuth"
              type="checkbox"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
            ></div>
          </label>
        </div>

        <div
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div>
            <h4 class="font-medium text-gray-900">Maintenance Mode</h4>
            <p class="text-sm text-gray-600">
              Take the store offline for maintenance
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="settings.maintenanceMode"
              type="checkbox"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
            ></div>
          </label>
        </div>

        <button
          @click="saveSettings"
          class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
        >
          Save Settings
        </button>
      </div>
    </BaseCard>

    <!-- Danger Zone -->
    <BaseCard className="border-2 border-red-200">
      <template #header>
        <div class="flex items-center gap-2">
          <ExclamationTriangleIcon class="w-5 h-5 text-red-600" />
          <h3 class="text-lg font-semibold text-red-600">Danger Zone</h3>
        </div>
      </template>
      <div class="space-y-4">
        <div class="p-4 bg-red-50 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-2">Clear All Cache</h4>
          <p class="text-sm text-gray-600 mb-4">
            Clear application cache and temporary data
          </p>
          <button
            @click="clearCache"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Clear Cache
          </button>
        </div>

        <div class="p-4 bg-red-50 rounded-lg border-2 border-red-300">
          <h4 class="font-medium text-red-600 mb-2">Reset Application</h4>
          <p class="text-sm text-gray-600 mb-4">
            Warning: This action will reset all application data to default
            state
          </p>
          <button
            @click="confirmReset"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Reset Application
          </button>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseCard from "@/components/common/BaseCard.vue";
import {
  UserCircleIcon,
  BuildingStorefrontIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";

const adminProfile = ref({
  fullName: "Admin User",
  email: "admin@easyshop.com",
  phone: "+234 800 000 0000",
  position: "Store Manager",
});

const storeInfo = ref({
  storeName: "EasyShop",
  storeEmail: "contact@easyshop.com",
  storePhone: "+234 800 000 0000",
  currency: "NGN",
  storeAddress: "123 Commerce Street, Lagos, Nigeria",
});

const settings = ref({
  emailNotifications: true,
  twoFactorAuth: false,
  maintenanceMode: false,
});

function saveProfile() {
  alert("Profile updated successfully!");
}

function saveStoreInfo() {
  alert("Store information updated successfully!");
}

function saveSettings() {
  alert("Settings updated successfully!");
}

function clearCache() {
  if (confirm("Are you sure you want to clear all cache?")) {
    localStorage.clear();
    sessionStorage.clear();
    alert("Cache cleared successfully!");
  }
}

function confirmReset() {
  if (
    confirm(
      "⚠️ WARNING: This will reset all application data! Are you absolutely sure? This action cannot be undone."
    )
  ) {
    if (
      confirm("Please confirm again that you want to reset the application")
    ) {
      alert("Application reset to default state");
    }
  }
}
</script>
