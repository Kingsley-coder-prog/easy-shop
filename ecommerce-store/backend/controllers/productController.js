const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  getProductsService,
  createProductService,
  updateProductService,
  deleteProductService,
} = require("../models/productsSheet");

const createProduct = async (req, res) => {
  try {
    const result = await createProductService(req.body);
    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
const getProducts = async (req, res) => {
  try {
    const products = await getProductsService();
    return res.status(StatusCodes.OK).json({ products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getProductByCategory = async (req, res) => {
  const category = req.params.category;
  const products = await getProductsService(category);
  res.json(products);
};

const updateProduct = async (req, res) => {
  try {
    const result = await updateProductService(req.params.product_id, req.body);
    if (result.error) return res.status(StatusCodes.NOT_FOUND).json(result);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const result = await deleteProductService(req.params.product_id);
    if (result.error) return res.status(StatusCodes.NOT_FOUND).json(result);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductByCategory,
  updateProduct,
  deleteProduct,
};
