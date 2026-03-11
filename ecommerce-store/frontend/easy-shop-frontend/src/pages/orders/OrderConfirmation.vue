<template>
  <div
    class="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-2xl mx-auto">
      <!-- Success Icon -->
      <div class="text-center mb-8">
        <div class="flex justify-center mb-6">
          <div class="rounded-full bg-green-100 p-6">
            <svg
              class="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          Payment Successful! ✅
        </h1>
        <p class="text-xl text-gray-600">
          Your order has been confirmed and payment received.
        </p>
      </div>

      <!-- Order Details Card -->
      <BaseCard v-if="orderDetails" class="mb-8">
        <div class="space-y-6">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              Order Details
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Order ID</p>
                <p class="text-lg font-mono font-semibold text-gray-900">
                  {{ orderDetails.order_id }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Payment Status</p>
                <p class="text-lg font-semibold text-green-600">
                  {{ orderDetails.payment_status?.toUpperCase() }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Amount</p>
                <p class="text-lg font-semibold text-gray-900">
                  ₦{{ Number(orderDetails.amount_naira).toLocaleString() }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Order Status</p>
                <p class="text-lg font-semibold text-blue-600">
                  {{ orderDetails.order_status?.toUpperCase() }}
                </p>
              </div>
            </div>
          </div>

          <!-- Items -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Items Ordered
            </h3>
            <div class="space-y-3">
              <div
                v-for="(item, idx) in orderItems"
                :key="idx"
                class="flex justify-between items-center py-3 border-b"
              >
                <div>
                  <p class="font-medium text-gray-900">{{ item.name }}</p>
                  <p class="text-sm text-gray-600">Qty: {{ item.quantity }}</p>
                </div>
                <p class="font-semibold text-gray-900">
                  ₦{{ (item.price * item.quantity).toLocaleString() }}
                </p>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="border-t pt-4">
            <p class="text-sm text-gray-600">
              We've sent a confirmation email to
              <span class="font-semibold">{{ orderDetails.email }}</span>
            </p>
          </div>
        </div>
      </BaseCard>

      <!-- Loading State -->
      <div v-else class="text-center py-12">
        <Loader size="lg" label="Loading orders" />
        <p class="text-gray-600 mt-4">Verifying your payment...</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <BaseButton
          @click="goToProducts"
          class="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Continue Shopping
        </BaseButton>
        <BaseButton
          @click="goToOrders"
          class="bg-gray-200 hover:bg-gray-300 text-gray-900"
        >
          View All Orders
        </BaseButton>
      </div>

      <!-- Note -->
      <div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-900">
          <strong>📦 Next Steps:</strong> Your order is being prepared. You'll
          receive an email update when it's ready for pickup/delivery.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useOrderStore } from "@/stores/order.store";
import BaseCard from "@/components/common/BaseCard.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import Loader from "@/components/common/Loader.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const orderStore = useOrderStore();

const orderDetails = ref(null);

const orderItems = computed(() => {
  const raw = orderDetails.value?.items_json;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
});

const goToProducts = () => {
  router.push("/products");
};

const goToOrders = () => {
  if (authStore.isAuthenticated) {
    router.push("/orders");
  } else {
    router.push("/login");
  }
};

const fetchOrderDetails = async () => {
  try {
    const reference = route.query.reference || route.query.trxref;
    if (!reference || !authStore.isAuthenticated) {
      orderDetails.value = null;
      return;
    }

    // 1) Fetch exact order for this logged-in user + paystack reference
    const byReference = await orderStore.fetchOrderByReference(reference);
    if (byReference) {
      orderDetails.value = byReference;
      return;
    }

    // 2) Fallback to user's own orders only
    const myOrders = await orderStore.fetchMyOrders();
    orderDetails.value = myOrders?.[0] || null;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    orderDetails.value = null;
  }
};

onMounted(async () => {
  await fetchOrderDetails();
});
</script>

<style scoped>
/* Smooth animations */
.order-confirmation {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>