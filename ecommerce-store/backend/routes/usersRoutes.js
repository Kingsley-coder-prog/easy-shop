// routes/usersRoutes.js
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const {
  getCurrentUser,
  listUsers,
  adminUpdateUser,
  adminDeleteUser,
} = require("../controllers/userController");
const { auth, adminOnly } = require("../middleware/authMiddleware");

// Public
router.post("/register", register);
router.post("/login", login);

// Protected
router.get("/getCurrentUser", auth, getCurrentUser);

// Admin routes
router.get("/", auth, adminOnly, listUsers);
router.put("/:id", auth, adminOnly, adminUpdateUser);
router.delete("/:id", auth, adminOnly, adminDeleteUser);

module.exports = router;
