const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  getOrdersService,
  createOrderService,
  updateOrderService,
  deleteOrderService,
} = require("../models/ordersSheet");

const createOrder = async (req, res) => {
  try {
    const result = await createOrderService(req.body);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
const getOrders = async (req, res) => {
  try {
    const orders = await getOrdersService();
    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
const updateOrder = async (req, res) => {
  try {
    const result = await updateOrderService(req.params.order_id, req.body);
    if (result.error) return res.status(404).json(result);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
const deleteOrder = async (req, res) => {
  try {
    const result = await deleteOrderService(req.params.order_id);
    if (result.error) return res.status(404).json(result);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createOrder, getOrders, updateOrder, deleteOrder };
