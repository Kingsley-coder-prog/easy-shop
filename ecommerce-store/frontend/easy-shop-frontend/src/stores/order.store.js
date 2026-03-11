import { defineStore } from "pinia";
import { orderService } from "@/api/orders.api";

export const useOrderStore = defineStore("orders", {
  state: () => ({
    orders: [],
    myOrders: [],
    currentOrder: null,
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

    async fetchMyOrders() {
      this.loading = true;
      try {
        const res = await orderService.listMine();
        const payload = res.data;

        if (Array.isArray(payload)) {
          this.myOrders = payload;
        } else if (Array.isArray(payload.orders)) {
          this.myOrders = payload.orders;
        } else if (payload.orders && Array.isArray(payload.orders.orders)) {
          this.myOrders = payload.orders.orders;
        } else {
          this.myOrders = [];
        }

        return this.myOrders;
      } finally {
        this.loading = false;
      }
    },

    async fetchOrderByReference(reference) {
      this.loading = true;
      try {
        const res = await orderService.getByReference(reference);
        const order = res?.data?.order || null;
        this.currentOrder = order;
        return order;
      } finally {
        this.loading = false;
      }
    },

    async updateOrder(orderId, data) {
      try {
        console.log("📝 Updating order from store:", { orderId, data });
        const res = await orderService.update(orderId, data);
        console.log("✅ Order updated response:", res);
        await this.fetchOrders();
        console.log("✅ Orders refreshed");
      } catch (err) {
        console.error("❌ Error updating order:", err);
        throw err;
      }
    },
  },
});
