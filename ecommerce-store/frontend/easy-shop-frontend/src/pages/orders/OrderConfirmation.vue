<template>
  <DefaultLayout />
</template>

<script>
// import { useRoute, useRouter } from "vue-router";
// import { useAuthStore } from "@/stores/auth.store";
// import { useOrderStore } from "@/stores/order.store";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
// import BaseCard from "@/components/common/BaseCard.vue";
// import BaseButton from "@/components/common/BaseButton.vue";
// import Loader from "@/components/common/Loader.vue";

export default {
  name: "OrderConfirmation",
  components: {
    DefaultLayout,
    // BaseCard,
    // BaseButton,
    // Loader,
  },
  // data() {
  //   return {
  //     orderDetails: null,
  //     orderItems: [],
  //   };
  // },
  // setup() {
  //   const route = useRoute();
  //   const router = useRouter();
  //   const authStore = useAuthStore();
  //   const orderStore = useOrderStore();

  //   return {
  //     route,
  //     router,
  //     authStore,
  //     orderStore,
  //   };
  // },
  // async mounted() {
  //   try {
  //     // Get reference from URL
  //     const reference = this.route.query.reference || this.route.query.trxref;

  //     if (!reference) {
  //       console.warn("No payment reference found");
  //       this.orderDetails = null;
  //       return;
  //     }

  //     // Fetch order details
  //     await this.fetchOrderDetails();
  //   } catch (error) {
  //     console.error("Error loading order confirmation:", error);
  //     this.orderDetails = null;
  //   }
  // },
  // methods: {
  //   async fetchOrderDetails() {
  //     try {
  //       // If user is authenticated, fetch their latest order
  //       if (this.authStore.isAuthenticated) {
  //         await this.orderStore.fetchOrders();
  //         // Get the most recent order
  //         if (this.orderStore.orders.length > 0) {
  //           this.orderDetails = this.orderStore.orders[0];
  //           this.parseOrderItems();
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch order details:", error);
  //     }
  //   },
  //   parseOrderItems() {
  //     if (this.orderDetails?.items_json) {
  //       try {
  //         const items =
  //           typeof this.orderDetails.items_json === "string"
  //             ? JSON.parse(this.orderDetails.items_json)
  //             : this.orderDetails.items_json;
  //         this.orderItems = items;
  //       } catch (e) {
  //         this.orderItems = [];
  //       }
  //     }
  //   },
  //   goToProducts() {
  //     this.router.push("/products");
  //   },
  //   goToOrders() {
  //     if (this.authStore.isAuthenticated) {
  //       this.router.push("/orders");
  //     } else {
  //       this.router.push("/login");
  //     }
  //   },
  // },
};
</script>

<style scoped>
/* Smooth animations */
/* .order-confirmation {
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
} */
</style>