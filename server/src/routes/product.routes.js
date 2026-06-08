const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const { uploadProductImages } = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", uploadProductImages.array("productImages", 12), createProduct);
router.put("/:id", uploadProductImages.array("productImages", 12), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
