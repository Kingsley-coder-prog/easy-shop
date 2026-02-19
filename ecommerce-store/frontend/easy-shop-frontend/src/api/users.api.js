import api from "./axios";

export const userService = {
  list() {
    return api.get("/users");
  },
  update(id, data) {
    return api.patch(`/users/${id}`, data);
  },
  remove(id) {
    return api.delete(`/users/${id}`);
  },
};
