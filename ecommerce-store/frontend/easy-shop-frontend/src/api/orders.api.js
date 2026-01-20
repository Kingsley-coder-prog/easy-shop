import api from "@/api/axios";

export const orderService = {
  list() {
    return api.get("/orders"); // Admin should be authenticated
  },
  get(orderId) {
    return api.get(`/orders/${orderId}`);
  },
  update(orderId, data) {
    return api.patch(`/orders/${orderId}`, data);
  },
};
