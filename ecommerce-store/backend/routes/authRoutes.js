// routes/usersRoutes.js
const express = require("express");
const router = express.Router();
const {
  register,
  registerAdmin,
  login,
  refresh,
  logout,
  logoutAll,
} = require("../controllers/authController");
const { auth, adminOnly } = require("../middlewares/authMiddleware");

// Public
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/register-admin").post(auth, adminOnly, registerAdmin);
router.route("/refresh").post(refresh);
router.route("/logout").get(auth, logout);
router.route("/logout-all").get(auth, logoutAll);

module.exports = router;
