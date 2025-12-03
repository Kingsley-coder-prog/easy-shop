const { StatusCodes } = require("http-status-codes");
// const CustomError = require("../errors");
const {
  getOrdersService,
  createOrderService,
  updateOrderService,
  deleteOrderService,
} = require("../models/ordersSheet");

const createOrder = async (req, res) => {
  try {
    const result = await createOrderService(req.body);
    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
const getOrders = async (req, res) => {
  try {
    const orders = await getOrdersService();
    return res.status(StatusCodes.OK).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getOrderByStatus = async (req, res) => {
  const status = req.params.status;
  const orders = await getOrdersService(status);
  res.json(orders);
};

const updateOrder = async (req, res) => {
  try {
    const result = await updateOrderService(req.params.order_id, req.body);
    if (result.error) return res.status(StatusCodes.NOT_FOUND).json(result);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const result = await deleteOrderService(req.params.order_id);
    if (result.error) return res.status(StatusCodes.NOT_FOUND).json(result);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderByStatus,
  updateOrder,
  deleteOrder,
};
