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
        this.orders = res.data.orders || res.data; // adjust based on API shape
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
