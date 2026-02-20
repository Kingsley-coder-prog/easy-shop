import api from "./axios";

export const productService = {
  getAll() {
    return api.get("/products");
  },

  create(data) {
    return api.post("/products", data);
  },

  update(id, data) {
    // Backend expects PATCH for updates
    return api.patch(`/products/${id}`, data);
  },

  remove(id) {
    return api.delete(`/products/${id}`);
  },
};
