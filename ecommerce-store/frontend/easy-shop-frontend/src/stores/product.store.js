import { defineStore } from "pinia";
import api from "@/api/axios";

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.get("/products");
        this.products = res.data.products || res.data;
      } catch (err) {
        this.error = "Failed to load products";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
});
