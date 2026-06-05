const categoryService = require("../services/category.service");

function validateCategory(category, res) {
  if (!category) {
    return res.status(404).json({
      message: "Category not found",
    });
  }
  const categoryName = category.trim();

  if (!categoryName.length > 0) {
    return res.status(404).json({
      message: "Category not found",
    });
  }

  if (categoryName.length < 5 || categoryName.length > 50) {
    return res.status(400).json({
      message: "Category length must be between 5 to 50",
    });
  }
  return categoryName;
}

const createCategory = async (req, res) => {
  try {
    const { categoryName, isStatus } = req.body;
    let category_name = validateCategory(categoryName, res);
    const category = await categoryService.createCategory({
      category_name,
      is_status: isStatus,
    });
    res.status(201).json({
      Status: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createCategory,
};
