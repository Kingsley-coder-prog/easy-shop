import { defineStore } from "pinia";
import { orderService } from "@/api/orders.api";

export const useOrderStore = defineStore("orders", {
  state: () => ({
    orders: [],
    loading: false,
  }),

  actions: {
    async fetchOrders() {
      this.loading = true;
      try {
        const res = await orderService.list();

        // Normalize response shapes from backend
        // Possible shapes:
        // 1. { orders: [ ... ] }
        // 2. { orders: { numberOfOrders, orders: [ ... ] } }
        // 3. [ ... ]
        const payload = res.data;

        if (Array.isArray(payload)) {
          this.orders = payload;
        } else if (Array.isArray(payload.orders)) {
          this.orders = payload.orders;
        } else if (payload.orders && Array.isArray(payload.orders.orders)) {
          this.orders = payload.orders.orders;
        } else {
          this.orders = [];
        }
      } finally {
        this.loading = false;
      }
    },

    async updateOrder(orderId, data) {
      await orderService.update(orderId, data);
      await this.fetchOrders();
    },
  },
});
