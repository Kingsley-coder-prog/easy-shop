// routes/usersRoutes.js
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  registerAdmin,
} = require("../controllers/authController");
const { auth, adminOnly } = require("../middlewares/authMiddleware");

// Public
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/register-admin").post(auth, adminOnly, registerAdmin);
router.route("/logout").get(auth, logout);

module.exports = router;
