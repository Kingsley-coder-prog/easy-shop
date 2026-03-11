const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getMyOrders,
  getMyOrderByReference,
  getOrderByStatus,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { auth, adminOnly } = require("../middlewares/authMiddleware");

router.route("/").post(auth, createOrder).get(auth, adminOnly, getOrders);
router.route("/my").get(auth, getMyOrders);
router.route("/reference/:reference").get(auth, getMyOrderByReference);
router.route("/status/:status").get(auth, adminOnly, getOrderByStatus);
router
  .route("/:order_id")
  .patch(auth, adminOnly, updateOrder)
  .delete(auth, adminOnly, deleteOrder);

module.exports = router;
