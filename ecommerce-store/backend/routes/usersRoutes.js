// routes/usersRoutes.js
const express = require("express");
const router = express.Router();

const { auth, adminOnly } = require("../middlewares/authMiddleware");
const {
  getCurrentUser,
  listUsers,
  adminUpdateUser,
  adminDeleteUser,
} = require("../controllers/userController");

// Protected
router.route("/getCurrentUser").get(auth, getCurrentUser);

// Admin routes
router.route("/").get(auth, adminOnly, listUsers);
router.route("/:id").put(auth, adminOnly, adminUpdateUser);
router.route("/:id").delete(auth, adminOnly, adminDeleteUser);

module.exports = router;
