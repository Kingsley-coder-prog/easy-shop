const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderByStatus,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.route("/").post(createOrder).get(getOrders);
router.route("/status/:status").get(getOrderByStatus);
router.route("/:order_id").patch(updateOrder).delete(deleteOrder);

module.exports = router;
