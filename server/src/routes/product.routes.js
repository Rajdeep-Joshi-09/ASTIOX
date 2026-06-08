const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const { uploadProductImage } = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", uploadProductImage.single("productImage"), createProduct);
router.put("/:id", uploadProductImage.single("productImage"), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
