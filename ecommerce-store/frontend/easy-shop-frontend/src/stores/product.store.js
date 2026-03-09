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
    lastFetchedAt: null,
  }),

  actions: {
    async fetchProducts(force = false) {
      const CACHE_TTL_MS = 5 * 60 * 1000;
      const now = Date.now();

      if (!force && this.products.length && this.lastFetchedAt) {
        if (now - this.lastFetchedAt < CACHE_TTL_MS) {
          return;
        }
      }

      if (!force && !this.products.length) {
        try {
          const cached = localStorage.getItem("easyshop_products_cache");
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed.products) && parsed.products.length) {
              this.products = parsed.products;
              this.lastFetchedAt = parsed.lastFetchedAt || null;
            }
          }
        } catch {
          // ignore cache parse errors
        }
      }

      this.loading = true;
      this.error = null;
      try {
        const response = await productService.getAll();

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

        this.lastFetchedAt = Date.now();
        localStorage.setItem(
          "easyshop_products_cache",
          JSON.stringify({
            products: this.products,
            lastFetchedAt: this.lastFetchedAt,
          }),
        );
      } catch (err) {
        console.error(err);
        this.error = "Failed to load products";
      } finally {
        this.loading = false;
      }
    },

    async createProduct(payload) {
      console.log("🎯 createProduct called with payload:", payload);
      try {
        const res = await productService.create(payload);
        console.log("✅ Product created, response:", res);
        await this.fetchProducts();
      } catch (err) {
        console.error("❌ createProduct failed:", err);
        throw err;
      }
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
