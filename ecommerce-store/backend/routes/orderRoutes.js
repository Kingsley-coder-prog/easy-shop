const express = require("express");
const router = express.Router();

const {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.route("/").post(createOrder).get(getOrders);

// router.get("/", getOrders);

router.route("/:order_id").put(updateOrder).delete(deleteOrder);

// router.delete("/:order_id", deleteOrder);

module.exports = router;
