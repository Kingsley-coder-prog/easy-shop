import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    isOpen: false,
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),

    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },

  actions: {
    toggle() {
      this.isOpen = !this.isOpen;
    },

    open() {
      this.isOpen = true;
    },

    close() {
      this.isOpen = false;
    },

    addItem(product) {
      const existing = this.items.find(
        (item) => item.id === product.id || item.id === product.product_id,
      );

      // Normalize product data
      const normalizedProduct = {
        id: product.product_id || product.id,
        name: product.name,
        price: product.price_naira || product.price || 0,
        image: product.image,
      };

      // Get quantity from product if specified, otherwise default to 1
      const quantityToAdd = product.quantity || 1;

      if (existing) {
        existing.quantity += quantityToAdd;
      } else {
        this.items.push({
          ...normalizedProduct,
          quantity: quantityToAdd,
        });
      }

      this.open();
    },

    removeItem(id) {
      this.items = this.items.filter((item) => item.id !== id);
    },

    updateQuantity(id, qty) {
      const item = this.items.find((item) => item.id === id);
      if (!item) return;

      if (qty <= 0) {
        this.removeItem(id);
      } else {
        item.quantity = qty;
      }
    },

    clear() {
      this.items = [];
      this.close();
    },
    // clearCart() {
    //   this.items = [];
    // },
  },
});
