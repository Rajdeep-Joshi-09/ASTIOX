const express = require("express");
const {
  getCategories,
  getCollections,
  getProducts,
  getProductById,
} = require("../controllers/public.controller");

const router = express.Router();

router.get("/categories", getCategories);
router.get("/collections", getCollections);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);

module.exports = router;
