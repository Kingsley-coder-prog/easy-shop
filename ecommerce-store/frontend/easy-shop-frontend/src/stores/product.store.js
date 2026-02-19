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
// import api from "@/api/axios";

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
        console.log("📡 Making API request to /products...");
        // const response = await api.get("/products");
        const response = await productService.getAll();
        console.log("📦 API Response:", response);

        // Normalize backend product shape to UI-friendly shape
        const raw = response.data.products || response.data || [];
        this.products = raw.map((p) => ({
          // keep both ids but expose `_id` for UI compatibility
          _id: p.product_id || p._id || p.id,
          product_id: p.product_id || p._id || p.id,
          name: p.name || p.product_name || "",
          description: p.description || "",
          price_naira: p.price_naira || p.price || 0,
          price: p.price_naira || p.price || 0,
          category: p.category || "",
          image: p.image || "",
          created_at: p.created_at || "",
          // keep raw reference
          __raw: p,
        }));

        console.log("✅ Products set:", this.products);
        console.log("✅ Products count:", this.products.length);
      } catch (err) {
        console.error(err);
        this.error = "Failed to load products";
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
      try {
        await productService.remove(id);
        this.products = this.products.filter(
          (p) => p._id !== id && p.product_id !== id,
        );
      } catch (err) {
        console.error("Failed to delete product", err);
        throw err;
      }
    },
  },
});
