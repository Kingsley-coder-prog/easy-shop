<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Checkout</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Order Summary -->
      <div class="md:col-span-2 bg-white p-6 rounded shadow">
        <h2 class="text-lg font-semibold mb-4">Order Summary</h2>

        <div
          v-for="item in cartItems"
          :key="item.id"
          class="flex justify-between border-b py-3"
        >
          <div>
            <p class="font-medium">{{ item.name }}</p>
            <p class="text-sm text-gray-500">
              {{ item.quantity }} × ₦{{ item.price }}
            </p>
          </div>

          <p class="font-semibold">₦{{ item.price * item.quantity }}</p>
        </div>

        <div class="flex justify-between mt-4 font-bold text-lg">
          <span>Total</span>
          <span>₦{{ totalPrice }}</span>
        </div>
      </div>

      <!-- Payment -->
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-lg font-semibold mb-4">Payment</h2>

        <button
          @click="payNow"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? "Processing..." : "Pay with Paystack" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import api from "@/api/axios";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";

const cartStore = useCartStore();
const authStore = useAuthStore();

const { items: cartItems, totalPrice } = storeToRefs(cartStore);
const loading = ref(false);

async function payNow() {
  if (cartItems.value.length === 0) {
    alert("Cart is empty");
    return;
  }

  try {
    loading.value = true;

    /**
     * 1️⃣ Create Order
     */
    const orderRes = await api.post("/orders", {
      user_name: authStore.user.name,
      email: authStore.user.email,
      items_json: cartItems.value,
      amount_naira: totalPrice.value,
      status: "Pending",
    });

    const orderId = orderRes.data.order.order_id;

    /**
     * 2️⃣ Initialize Paystack Payment
     */
    const paymentRes = await api.post("/payments/create", {
      order_id: orderId,
    });

    /**
     * 3️⃣ Redirect to Paystack
     */
    window.location.href = paymentRes.data.authorization_url;
  } catch (err) {
    console.error(err);
    alert("Payment failed");
  } finally {
    loading.value = false;
  }
}
</script>
