// routes/usersRoutes.js
const express = require("express");
const router = express.Router();
const {
  register,
  registerAdmin,
  login,
} = require("../controllers/authController");
const { auth, adminOnly } = require("../middlewares/authMiddleware");
const {
  getCurrentUser,
  listUsers,
  adminUpdateUser,
  adminDeleteUser,
} = require("../controllers/userController");

// Public
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/register-admin").post(auth, adminOnly, registerAdmin);

// Protected
router.get("/getCurrentUser", auth, getCurrentUser);

// Admin routes
router.get("/", auth, adminOnly, listUsers);
router.put("/:id", auth, adminOnly, adminUpdateUser);
router.delete("/:id", auth, adminOnly, adminDeleteUser);

module.exports = router;
