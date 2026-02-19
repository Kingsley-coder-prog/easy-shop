import { defineStore } from "pinia";
import { userService } from "@/api/users.api";

export const useUserStore = defineStore("users", {
  state: () => ({
    users: [],
    loading: false,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true;
      try {
        const res = await userService.list();
        this.users = res.data.users || res.data || [];
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        this.loading = false;
      }
    },
    async updateUser(id, payload) {
      this.loading = true;
      try {
        await userService.update(id, payload);
        await this.fetchUsers();
      } catch (err) {
        console.error("Failed to update user", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id) {
      if (!confirm("Delete this user?")) return;
      this.loading = true;
      try {
        await userService.remove(id);
        await this.fetchUsers();
      } catch (err) {
        console.error("Failed to delete user", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
