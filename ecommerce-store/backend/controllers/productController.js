const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  getProductsService,
  createProductService,
  updateProductService,
  deleteProductService,
} = require("../models/productsSheet");
const { getPresignedUploadUrl } = require("../services/s3");

const PRODUCTS_CACHE_TTL_MS = 60 * 1000;
const productsCache = new Map();

const getCacheEntry = (key) => {
  const entry = productsCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > PRODUCTS_CACHE_TTL_MS) {
    productsCache.delete(key);
    return null;
  }
  return entry.data;
};

const setCacheEntry = (key, data) => {
  productsCache.set(key, {
    data,
    cachedAt: Date.now(),
  });
};

const invalidateProductsCache = () => {
  productsCache.clear();
};

const createProduct = async (req, res) => {
  try {
    const result = await createProductService(req.body);
    invalidateProductsCache();
    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
const getProducts = async (req, res) => {
  try {
    const cacheKey = "all-products";
    const cachedProducts = getCacheEntry(cacheKey);
    if (cachedProducts) {
      res.set("Cache-Control", "public, max-age=60");
      return res.status(StatusCodes.OK).json({ products: cachedProducts });
    }

    const products = await getProductsService();
    setCacheEntry(cacheKey, products);
    res.set("Cache-Control", "public, max-age=60");
    return res.status(StatusCodes.OK).json({ products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getProductByCategory = async (req, res) => {
  const category = req.params.category;
  const cacheKey = `category:${category}`;
  const cachedProducts = getCacheEntry(cacheKey);
  if (cachedProducts) {
    res.set("Cache-Control", "public, max-age=60");
    return res.json(cachedProducts);
  }

  const products = await getProductsService(category);
  setCacheEntry(cacheKey, products);
  res.set("Cache-Control", "public, max-age=60");
  res.json(products);
};

const updateProduct = async (req, res) => {
  try {
    const result = await updateProductService(req.params.product_id, req.body);
    if (!result.error) invalidateProductsCache();
    if (result.error) return res.status(StatusCodes.NOT_FOUND).json(result);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const result = await deleteProductService(req.params.product_id);
    if (!result.error) invalidateProductsCache();
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
