const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductByCategory,
  updateProduct,
  deleteProduct,
  getUploadUrl,
} = require("../controllers/productController");

router.route("/").post(createProduct).get(getProducts);
router.route("/upload-url").post(getUploadUrl);
router.route("/category/:category").get(getProductByCategory);
router.route("/:product_id").patch(updateProduct).delete(deleteProduct);

module.exports = router;
