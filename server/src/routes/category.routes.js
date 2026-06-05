const express = require("express");

const {
  createCategory,
  getCategory,
  getCategoryById,
  deleteCategory,
  updateCategoryController,
} = require("../controllers/category.controller");

const router = express.Router();

router.get("/", getCategory);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.delete("/:id", deleteCategory);
router.put("/:id", updateCategoryController);

module.exports = router;
