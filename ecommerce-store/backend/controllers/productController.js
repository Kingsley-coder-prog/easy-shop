const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  getProductsService,
  createProductService,
  updateProductService,
  deleteProductService,
} = require("../models/productsSheet");
const { getPresignedUploadUrl } = require("../services/s3");

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

const getUploadUrl = async (req, res) => {
  try {
    const { fileName, mimeType } = req.body;

    if (!fileName || !mimeType) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "fileName and mimeType are required",
      });
    }

    // Validate file type (only allow images)
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedMimeTypes.includes(mimeType)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Only image files (JPEG, PNG, GIF, WebP) are allowed",
      });
    }

    const uploadData = await getPresignedUploadUrl(fileName, mimeType);
    return res.status(StatusCodes.OK).json(uploadData);
  } catch (error) {
    console.error("Upload URL Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to generate upload URL" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductByCategory,
  updateProduct,
  deleteProduct,
  getUploadUrl,
};
