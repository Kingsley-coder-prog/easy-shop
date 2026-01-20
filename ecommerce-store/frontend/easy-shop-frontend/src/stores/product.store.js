// import { defineStore } from "pinia";
// import api from "@/api/axios";

// export const useProductsStore = defineStore("products", {
//   state: () => ({
//     products: [],
//     loading: false,
//     error: null,
//   }),

//   actions: {
//     async fetchProducts() {
//       this.loading = true;
//       this.error = null;

//       try {
//         const res = await api.get("/products");
//         this.products = res.data.products || res.data;
//       } catch (err) {
//         this.error = "Failed to load products";
//         console.error(err);
//       } finally {
//         this.loading = false;
//       }
//     },
//   },
// });

import { defineStore } from "pinia";
import { productService } from "@/api/products.api";

export const useProductStore = defineStore("products", {
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
        const res = await productService.getAll();
        this.products = res.data;
      } catch (err) {
        this.error = "Failed to load products";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async createProduct(payload) {
      await productService.create(payload);
      await this.fetchProducts();
    },

    async updateProduct(id, payload) {
      await productService.update(id, payload);
      await this.fetchProducts();
    },

    async deleteProduct(id) {
      await productService.remove(id);
      this.products = this.products.filter((p) => p._id !== id);
    },
  },
});
