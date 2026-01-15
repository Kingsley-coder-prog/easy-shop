import { defineStore } from "pinia";
import api from "@/api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem("accessToken"),
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isAdmin: (state) => state.user?.role === "admin",
  },

  actions: {
    async login(credentials) {
      const res = await api.post("/auth/login", credentials);

      this.user = res.data.user;
      this.accessToken = res.data.accessToken;

      localStorage.setItem("accessToken", res.data.accessToken);
    },

    async register(payload) {
      const res = await api.post("/auth/register", payload);
      this.user = res.data.user;
      this.accessToken = res.data.accessToken;
      localStorage.setItem("accessToken", res.data.accessToken);
    },

    async fetchCurrentUser() {
      try {
        const res = await api.get("/users/getCurrentUser");
        this.user = res.data.user;
      } catch (err) {
        // Token might be invalid or expired
        this.logout();
      }
    },

    logout() {
      this.user = null;
      this.accessToken = null;
      localStorage.removeItem("accessToken");
    },
  },
});
